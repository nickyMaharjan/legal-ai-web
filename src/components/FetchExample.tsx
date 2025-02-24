import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchSalesData() {
    return axios.get("https://api.mockaroo.com/api/b4a7cff0?count=10&key=a0969580")    
}

export default function FetchExaxmple({count}: {count: number}) {
    const {data} = useQuery({
        queryKey: ['sales'],
        queryFn: fetchSalesData,
    })
    
    return (
        <div>
            <h1>Fetch Example:</h1>
            <p>Count from Fetch Example: {count}</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    );
}