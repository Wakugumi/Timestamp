import { useNavigate } from "react-router";
import Icon from "../components/Icon";
import WelcomeBanner from "../components/WelcomeBanner";
import { usePhase } from "../contexts/PhaseContext";

export default function WelcomePage() {
    const phase = usePhase();
    const navigate = useNavigate();

    const handleLaunch = () => {
        localStorage.setItem('hasUserInteracted', 'true');
        phase.setCurrentPhase(1); navigate("phase1");
    }

    return (
        <>
            
        <div className="grid grid-cols-2 grid-rows-2 gap-0
        min-w-full max-h-svh">
            <div className="row-span-2">
                <div className="h-full overflow-hidden">
                    <WelcomeBanner/>
                </div>
            </div>
            <div className='col-start-2 row-start-1
            flex justify-center items-center'>
                <h1 className="text-8xl text-primary">Timestamp</h1>
            </div>
            <div className="col-start-2
            flex justify-center items-center gap-4">
                
                <button className="btn py-8 px-16 text-xl flex items-center gap-4" onClick={ handleLaunch }>
                <Icon type="launch"/>
                Start</button>
            </div>
        </div>
    
        </>
    )
}