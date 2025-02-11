import axios from "axios";
const SERVR_URL = import.meta.env.VITE_SERVER_URL;
// const SERVR_URL = window.location.origin;
export default {
  post : {
    sendMail : async (input) => {
      try{
        const response = await axios.post(`${SERVR_URL}/mailGen`,{input});
        // const response = await axios.post(`${SERVR_URL}/mailGen`,{input});
        console.log(response, "From UI");
        return response.data;
      }
      catch (err){
        throw err;
      }
    }
  },
};
