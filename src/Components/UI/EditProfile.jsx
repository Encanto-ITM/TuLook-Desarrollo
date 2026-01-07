import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import EditInput from './EditInputs';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import ChangePassword from './ChangePassword';

export function EditProfile({ open, onClose, user, onProfileUpdated }) {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(user.profilephoto || '/img/Death Note.jpg'); 
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setShowContent(true);
      setIsExiting(false);
      setName(user.name || '');
      setLastname(user.lastname || '');
      setDescription(user.description || '');
      setContactNumber(user.contact_number || '');
      setPreviewPhoto(user.profilephoto || '/img/Death Note.jpg');
      setProfilePhoto(null);
      setErrors({});
    } else if (isExiting) {
      setShowContent(false);
    }
  }, [open, user, isExiting]);

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Este campo es obligatorio';
    if (!lastname) newErrors.lastname = 'Este campo es obligatorio';
    if (!description) newErrors.description = 'Este campo es obligatorio';
    if (!contactNumber) newErrors.contactNumber = 'Este campo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastname', lastname);
    formData.append('description', description);
    formData.append('contact_number', contactNumber);
    formData.append('_method', 'PUT');
    if (profilePhoto) {
      formData.append('profilephoto', profilePhoto);
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://tulookapiv2.vercel.app/api/api/users/${user.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al actualizar la información: ${errorMessage}`);
      }

      const responseBody = await response.json();
      onProfileUpdated(responseBody);
      closeModal();
    } catch (error) {
      console.error('Error al actualizar la información:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Modal open={open} onClose={closeModal}>
        <Box className="fixed inset-0 flex items-start justify-end p-4 pt-20">
          <Grow in={showContent && !isExiting} timeout={500}>
            <div className="max-w-lg w-full rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '90vh' }}>
              <div className="bg-white text-black rounded-t-lg p-4 relative flex flex-col items-center text-center">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-black focus:outline-none"
                >
                  X
                </button>
                <h2 className="text-2xl font-bold text-center mb-4">Editar Perfil</h2>
                <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full border-2 border-gray-300 overflow-hidden">
                  <label htmlFor="profilePhotoInput" className="cursor-pointer">
                    <img
                      className="w-full h-full object-cover"
                      src={previewPhoto}
                      alt="Profile Preview"
                      onError={(e) => {
                          e.target.src = '/img/template-img.png';
                      }}
                    />
                  </label>
                  <input
                    id="profilePhotoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="bg-purple text-white p-4 rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 justify-items-center">
                  <EditInput label="Nombre" id="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
                  <EditInput label="Apellido" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} error={errors.lastname} />
                  <EditInput label="Descripción" id="description" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
                  <EditInput label="Número de Contacto" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} error={errors.contactNumber} />
                </div>

                <div className="flex flex-col md:flex-row mt-10 mb-16 md:space-y-0 md:space-x-4">
                  <button
                    onClick={handleUpdate}
                    className={`rounded border-2 bg-white text-purple p-2 hover:scale-105 duration-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'w-full md:w-1/2'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Actualizando...' : 'Confirmar Editar'}
                  </button>
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="rounded border-2 bg-white text-purple mt-4 p-2 hover:scale-105 duration-500 w-full md:w-1/2"
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </div>
          </Grow>
        </Box>
      </Modal>

      <ChangePassword
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        user={user}
        onPasswordUpdated={(updatedUser) => console.log('Contraseña actualizada:', updatedUser)}
      />
    </>
  );
}
