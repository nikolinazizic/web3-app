import { toast } from 'react-toastify';


export const notify1 = () => {
    toast("🙌 Successfully updated property details! ✔️🎉", {
        className: 'bg-white text-blue-700 text-semibold p-4 rounded-lg shadow-lg',
        autoClose: 14000,
    });
}

export const notify2 = () => {
    toast("🙌 Successfully updated property price! ✔️🎉", {
        className: 'bg-white text-blue-700 text-semibold p-4 rounded-lg shadow-lg',
        autoClose: 14000,
    });
}

export const notify3 = () => {
    toast("🙌 Property bought successfully! ✔️🎉", {
        className: 'bg-white text-blue-700 text-semibold p-4 rounded-lg shadow-lg',
        autoClose: 14000,
    });
}

export const notify = () => {
    toast("🙌 Successfully registered new property! ✔️🎉", {
  
        className: 'bg-white text-blue-700 text-semibold p-4 rounded-lg shadow-lg',
        autoClose: 14000,

    });
  }