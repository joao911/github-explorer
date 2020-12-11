import React, { useState, FormEvent, useEffect } from 'react';
import Logo from '../../assets/img/logo.png';
import api from '../../services/api';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories } from './styles'
import {Link} from 'react-router-dom';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}
const Dashboard: React.FC = () => {

  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);
  
  async function handleAddRepository
    (event: FormEvent<HTMLFormElement>)
    : Promise<void> {
    event.preventDefault()
    const response = await api.get<Repository>(`repos/${newRepo}`);
    const repository = response.data;

    setRepositories([...repositories, repository])
    setNewRepo('');
  }

  return (
    <div>
      <img src={Logo} alt="Explorer GitHub" />
      <Title>
        Explore Repositórios no GitHub
      </Title>
      <Form onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit"> Pesquisar</button>
      </Form>
      <Repositories>
        {repositories.map(repository => (

          <Link key={repository.full_name} to={`repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url}
              alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}

      </Repositories>
    </div>
  )
}

export default Dashboard;