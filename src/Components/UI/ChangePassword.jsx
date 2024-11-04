import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import ImageUploader from './ImageUploader';
import EditInput from './EditInputs';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';

export default function ChangePassword({ open, onClose, user, onPasswordUpdated }) {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setShowContent(true);
      setIsExiting(false);
      setEmail(user.email || ''); 
    } else {
      if (isExiting) {
        setShowContent(false);
      }
    }
  }, [open, user, isExiting]);

  const handleUpdatePassword = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      return;
    }
  
    const data = {
      email: email.trim(),
      old_password: oldPassword.trim(),
      new_password: newPassword.trim(),
    };
  
    try {
      const response = await fetch(`https://tulookapiv2.vercel.app/api/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    
      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      onPasswordUpdated(result);
      closeModal();
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error.message || error);
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

  return (
    <Modal open={open} onClose={closeModal}>
      <Box className="fixed inset-0 flex items-start justify-end p-4 pt-20">
        <Grow in={showContent && !isExiting} timeout={500}>
          <div className="max-w-lg w-full rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="bg-white text-black rounded-t-lg p-4 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-black focus:outline-none"
              >
                X
              </button>
              <h2 className="text-2xl font-bold text-center mb-4">Cambiar Contraseña</h2>
              <ImageUploader /> 
            </div>

            <div className="bg-purple text-white p-4 rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 justify-items-center">
                <EditInput label="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <EditInput label="Contraseña Anterior" id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                <EditInput label="Nueva Contraseña" id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <EditInput label="Confirmar Contraseña" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleUpdatePassword}
                  className={`rounded mt-2 border-2 bg-blue border-blue text-white p-2 w-3/4 my-8 hover:scale-105 duration-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </div>
            </div>
          </div>
        </Grow>
      </Box>
    </Modal>
  );
}