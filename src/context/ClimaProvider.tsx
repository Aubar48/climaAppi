import axios from "axios";
import { ChangeEvent, PropsWithChildren, createContext, useState } from "react";

interface BusquedaPayload{
    ciudad : string,
    pais : string
}

interface ResultadoApiPayload{
    name : string,
        main :{
            temp: number,
            temp_max: number,
            temp_min : number,
        }
}

export interface ClimaContextProps{
    busqueda : BusquedaPayload;
    resultado :ResultadoApiPayload;
    actualizarDatosBusqueda:  (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    consultarClima : (datos: BusquedaPayload) => void;
    cargando : boolean;
}

const ClimaContext = createContext<ClimaContextProps>( {} as ClimaContextProps);

const ClimaProvider = ({children}: PropsWithChildren)=>{
   
const [busqueda, setBusqueda] = useState<BusquedaPayload>({
   ciudad:"",
   pais:""
})

const [resultado, setResultado] = useState<ResultadoApiPayload>({} as ResultadoApiPayload)
const [cargando, setCargando] = useState(false)

const actualizarDatosBusqueda = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBusqueda({
        ...busqueda,
        [e.target.name] : e.target.value
    })
}

const consultarClima = async (datos : BusquedaPayload) => {
    setCargando(true)
    try {
        
        const {ciudad, pais} = datos;
        const apiKey = import.meta.env.VITE_API_KEY 
        const urlGeoLocation = `http://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&q=${ciudad},${pais}`    
        const {data} = await axios.get(urlGeoLocation)
        const {lat, lon} = data[0]
        const urlRequestClima = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}` 
        const {data : datosClima} = await axios.get(urlRequestClima)
        setResultado(datosClima)
        
    
    } catch (error) {
        console.log(error); 
    } finally{
        setCargando(false)
    }
}
    return (
        <ClimaContext.Provider
        value={{
            busqueda,
            resultado,
            actualizarDatosBusqueda,
            consultarClima,
            cargando
        }} 
        >
            {children}
        </ClimaContext.Provider>
    )
}
export {
        ClimaProvider   
}
export default ClimaContext 
