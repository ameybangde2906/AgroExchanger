import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
        mutationFn: async (formData) => {
          try {
            const res = await fetch(`http://localhost:5000/api/user/update`, {
              credentials: "include",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || "Something went wrong");
            }
            return data;
          } catch (error) {
            throw new Error(error.message);
          }
        },
        onSuccess: () => {
          Promise.all([
            queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          ]);
          
        },
        onError: (error) => { },
      });

      return {updateProfile, isUpdating}

}

export default useUpdateProfile