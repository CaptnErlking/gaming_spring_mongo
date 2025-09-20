import React, { useState, useMemo } from 'react';
import { useMembers, useUpdateMember, useDeleteMember } from '../../hooks/useMembers';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Shield,
  ShieldOff,
  Crown
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Member } from '../../types';

const AdminMembersPage: React.FC = () => {
  const { data: members = [], isLoading } = useMembers();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.phoneNumber.includes(searchTerm);
      const matchesRole = !filterRole || member.role === filterRole;
      const matchesStatus = !filterStatus || 
        (filterStatus === 'active' && member.isActive) ||
        (filterStatus === 'inactive' && !member.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchTerm, filterRole, filterStatus]);

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleDelete = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const handleToggleStatus = async (member: Member) => {
    await updateMember.mutateAsync({
      id: member.id,
      member: { isActive: !member.isActive }
    });
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      await deleteMember.mutateAsync(memberToDelete.id);
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-bold text-text-primary">Manage Members</h1>
        </div>
        <div className="text-text-muted">
          {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-field"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left p-4 text-text-primary font-semibold">Member</th>
                <th className="text-left p-4 text-text-primary font-semibold">Contact</th>
                <th className="text-left p-4 text-text-primary font-semibold">Balance</th>
                <th className="text-left p-4 text-text-primary font-semibold">Role</th>
                <th className="text-left p-4 text-text-primary font-semibold">Status</th>
                <th className="text-left p-4 text-text-primary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-accent-primary" />
                      </div>
                      <div>
                        <h3 className="text-text-primary font-medium">{member.name}</h3>
                        <p className="text-text-muted text-sm">
                          Joined {member.joiningDate ? formatDateTime(member.joiningDate) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-text-muted" />
                        <span className="text-text-muted text-sm">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-text-muted" />
                        <span className="text-text-muted text-sm">{member.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-text-primary font-semibold">
                      {formatCurrency(member.balance || 0)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {member.role === 'ADMIN' ? (
                        <Crown className="w-4 h-4 text-accent-secondary" />
                      ) : (
                        <User className="w-4 h-4 text-accent-primary" />
                      )}
                      <span className="text-text-muted capitalize">{member.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(member)}
                        className={member.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
                      >
                        {member.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(member)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No members found
            </h3>
            <p className="text-text-muted">
              {searchTerm || filterRole || filterStatus
                ? 'Try adjusting your search or filter criteria'
                : 'No members have been registered yet'
              }
            </p>
          </div>
        )}
      </Card>

      {/* Member Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Member"
        size="lg"
      >
        {editingMember && (
          <MemberForm
            member={editingMember}
            onClose={() => setShowModal(false)}
            onSave={async (memberData) => {
              await updateMember.mutateAsync({ id: editingMember.id, member: memberData });
              setShowModal(false);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Member"
      >
        {memberToDelete && (
          <div className="space-y-4">
            <p className="text-text-primary">
              Are you sure you want to delete <strong>{memberToDelete.name}</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                loading={deleteMember.isPending}
                className="flex-1"
              >
                Delete Member
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Member Form Component
interface MemberFormProps {
  member: Member;
  onClose: () => void;
  onSave: (memberData: Partial<Member>) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    phoneNumber: member.phoneNumber,
    balance: member.balance || 0,
    role: member.role || 'USER',
    isActive: member.isActive,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />

        <Input
          label="Balance"
          type="number"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.01"
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
            className="input-field"
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-accent-primary bg-bg-secondary border-border-primary rounded focus:ring-accent-primary"
          />
          <label htmlFor="isActive" className="text-text-primary">
            Active Member
          </label>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Update Member
        </Button>
      </div>
    </form>
  );
};

export default AdminMembersPage;
