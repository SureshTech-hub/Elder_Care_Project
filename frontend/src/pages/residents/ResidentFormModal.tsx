import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Resident } from '../../types';

interface ResidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Resident | null;
  isLoading?: boolean;
}

export const ResidentFormModal: React.FC<ResidentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        residentId: initialData.residentId,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        gender: initialData.gender,
        age: initialData.age,
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        phone: initialData.phone || '',
        emergencyContactName: initialData.emergencyContactName,
        emergencyContactPhone: initialData.emergencyContactPhone,
        address: initialData.address || '',
        bloodGroup: initialData.bloodGroup || '',
        roomNumber: initialData.roomNumber || '',
        status: initialData.status || 'ACTIVE',
        medicalConditions: initialData.medicalConditions ? initialData.medicalConditions.join(', ') : '',
        allergies: initialData.allergies ? initialData.allergies.join(', ') : '',
      });
    } else {
      reset({
        residentId: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: '',
        lastName: '',
        gender: 'Male',
        age: 75,
        emergencyContactName: '',
        emergencyContactPhone: '',
        status: 'ACTIVE',
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = (formData: any) => {
    const payload = {
      ...formData,
      age: Number(formData.age),
      medicalConditions: formData.medicalConditions
        ? formData.medicalConditions.split(',').map((s: string) => s.trim())
        : [],
      allergies: formData.allergies
        ? formData.allergies.split(',').map((s: string) => s.trim())
        : [],
    };
    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Resident Record' : 'Create Resident Record'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Resident ID"
            {...register('residentId', { required: 'Resident ID is required' })}
            error={errors.residentId?.message as string}
          />

          <Select
            label="Status"
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Discharged', value: 'DISCHARGED' },
            ]}
            {...register('status')}
          />

          <Input
            label="First Name"
            {...register('firstName', { required: 'First name is required' })}
            error={errors.firstName?.message as string}
          />

          <Input
            label="Last Name"
            {...register('lastName', { required: 'Last name is required' })}
            error={errors.lastName?.message as string}
          />

          <Select
            label="Gender"
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
            {...register('gender')}
          />

          <Input
            label="Age"
            type="number"
            {...register('age', { required: 'Age is required', min: 0 })}
            error={errors.age?.message as string}
          />

          <Input label="Room Number" placeholder="e.g. 102A" {...register('roomNumber')} />

          <Input label="Blood Group" placeholder="e.g. O+" {...register('bloodGroup')} />

          <Input
            label="Emergency Contact Name"
            {...register('emergencyContactName', { required: 'Required' })}
            error={errors.emergencyContactName?.message as string}
          />

          <Input
            label="Emergency Contact Phone"
            {...register('emergencyContactPhone', { required: 'Required' })}
            error={errors.emergencyContactPhone?.message as string}
          />

          <Input label="Phone" {...register('phone')} />
          <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
        </div>

        <Input
          label="Medical Conditions (comma separated)"
          placeholder="Hypertension, Diabetes, Fall Risk"
          {...register('medicalConditions')}
        />

        <Input
          label="Allergies (comma separated)"
          placeholder="Penicillin, Peanuts"
          {...register('allergies')}
        />

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Resident' : 'Save Resident'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
