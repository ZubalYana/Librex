const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

export const apiFetch = async(
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = localStorage.getItem("token");

    try{
        const res = await fetch(`${BASE_URL}${url}`, {
            method: options.method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: options.body
        });

        if(!res.ok){
            if(res.status === 401){
                window.location.href = "/login";
                throw new Error("Unauthorized");
            }
            throw new Error(`Request failed with status ${res.status}`);
        }

        return res;
    }catch(err){
        console.error(err);
        throw err;
    }
};