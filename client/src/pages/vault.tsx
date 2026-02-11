import { useParams } from 'react-router-dom';
import VaultView from '../components/VaultView';

export default function Vault() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="text-center py-20 text-red-600">
        Invalid vault link
      </div>
    );
  }

  return <VaultView id={id} />;
}
