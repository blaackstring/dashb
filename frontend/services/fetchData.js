
    export const fetchData = async () => {
      try {
        const res = await fetch('/api/v1/get_data', {
          method: "GET",
          credentials: "include"
        }).then(res => res.json());
    console.log(res);
    
        if (res.success) {
         return res
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };


