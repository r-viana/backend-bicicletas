import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CriarUsuarioDto } from '../dtos/criaUsuario.dto';
import { AtualizarUsuarioDto } from '../dtos/atualizaUsuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async criar(criarUsuarioDto: CriarUsuarioDto): Promise<Usuario> {
    // Verifica se email já existe
    const emailExiste = await this.usuarioRepository.findOne({
      where: { email: criarUsuarioDto.email }
    });

    if (emailExiste) {
      throw new ConflictException('Email já está em uso');
    }

    // Verifica se CPF já existe
    const cpfExiste = await this.usuarioRepository.findOne({
      where: { cpf: criarUsuarioDto.cpf }
    });

    if (cpfExiste) {
      throw new ConflictException('CPF já está cadastrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(criarUsuarioDto.senha, 10);

    const usuario = this.usuarioRepository.create({
      ...criarUsuarioDto,
      senha: senhaHash,
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    // Remove a senha do retorno por segurança
    const { senha, ...usuarioSemSenha } = usuarioSalvo;
    return usuarioSemSenha as Usuario;
  }

  async buscarTodos(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find({
      relations: ['alugueis'],
      order: { nome: 'ASC' },
      select: ['id', 'nome', 'email', 'cpf', 'telefone', 'ativo', 'data_cadastro'], // Exclui senha
    });

    return usuarios;
  }

  async buscarPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['alugueis'],
      select: ['id', 'nome', 'email', 'cpf', 'telefone', 'ativo', 'data_cadastro'], // Exclui senha
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return usuario;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      // Inclui senha para autenticação
    });
  }

  async atualizar(id: number, atualizarUsuarioDto: AtualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Se está atualizando email, verifica se não está em uso por outro usuário
    if (atualizarUsuarioDto.email && atualizarUsuarioDto.email !== usuario.email) {
      const emailExiste = await this.usuarioRepository.findOne({
        where: { email: atualizarUsuarioDto.email }
      });

      if (emailExiste) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }

    // Se está atualizando CPF, verifica se não está em uso por outro usuário
    if (atualizarUsuarioDto.cpf && atualizarUsuarioDto.cpf !== usuario.cpf) {
      const cpfExiste = await this.usuarioRepository.findOne({
        where: { cpf: atualizarUsuarioDto.cpf }
      });

      if (cpfExiste) {
        throw new ConflictException('CPF já está em uso por outro usuário');
      }
    }

    // Se está atualizando senha, faz hash
    if (atualizarUsuarioDto.senha) {
      atualizarUsuarioDto.senha = await bcrypt.hash(atualizarUsuarioDto.senha, 10);
    }

    await this.usuarioRepository.update(id, atualizarUsuarioDto);
    return this.buscarPorId(id);
  }

  async remover(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['alugueis'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Verifica se tem aluguéis ativos
    const aluguelsAtivos = usuario.alugueis?.filter(aluguel => 
      aluguel.status === 'ATIVO'
    );

    if (aluguelsAtivos && aluguelsAtivos.length > 0) {
      throw new BadRequestException('Não é possível remover usuário com aluguéis ativos');
    }

    await this.usuarioRepository.remove(usuario);
  }

  async desativar(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['alugueis'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Verifica se tem aluguéis ativos
    const aluguelsAtivos = usuario.alugueis?.filter(aluguel => 
      aluguel.status === 'ATIVO'
    );

    if (aluguelsAtivos && aluguelsAtivos.length > 0) {
      throw new BadRequestException('Não é possível desativar usuário com aluguéis ativos');
    }

    await this.usuarioRepository.update(id, { ativo: false });
    return this.buscarPorId(id);
  }

  async ativar(id: number): Promise<Usuario> {
    await this.usuarioRepository.update(id, { ativo: true });
    return this.buscarPorId(id);
  }

  async validarSenha(senha: string, senhaHash: string): Promise<boolean> {
    return await bcrypt.compare(senha, senhaHash);
  }

  async alterarSenha(id: number, senhaAtual: string, novaSenha: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Valida senha atual
    const senhaValida = await this.validarSenha(senhaAtual, usuario.senha);
    if (!senhaValida) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await this.usuarioRepository.update(id, { senha: novaSenhaHash });
  }

  async buscarAtivos(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { ativo: true },
      select: ['id', 'nome', 'email', 'cpf', 'telefone', 'ativo', 'data_cadastro'],
      order: { nome: 'ASC' },
    });
  }
}
