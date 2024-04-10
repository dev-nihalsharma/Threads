import React from 'react';
import { useToast } from '@chakra-ui/react';

const usePreviewImage = () => {
  const [previewImage, setPreviewImage] = React.useState(null);
  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => setPreviewImage(reader.result);

      reader.readAsDataURL(file);
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a valid file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    handleImageChange,
    previewImage,
    setPreviewImage,
  };
};

export default usePreviewImage;
