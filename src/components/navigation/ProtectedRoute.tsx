import { Navigate } from 'react-router-dom';
import { usePhase } from '../../contexts/PhaseContext';
import React from 'react';

const ProtectedRoute: React.FC< { phaseNumber: number, children: React.ReactNode } > = ({ phaseNumber, children}) => {
    const { currentPhase } = usePhase();

    if (currentPhase < phaseNumber) {
        return <Navigate to={`/phase${currentPhase}`} replace />;
    }

    return <> {children} </>
}

export default ProtectedRoute;