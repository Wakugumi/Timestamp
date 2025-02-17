import { Navigate, useNavigationType } from "react-router-dom";
import { usePhase } from "../../contexts/PhaseContext";
import React, { useState } from "react";
import LoggerService from "../../services/LoggerService";
import ErrorPage from "../ErrorPage";
import useIdleTimer from "../../hooks/useIdleTimer";
import Button from "../Button";
import Page from "../Page";
import { useNavigate } from "react-router";

const ProtectedRoute: React.FC<{
  phaseNumber: number;
  children: React.ReactNode;
}> = ({ phaseNumber, children }) => {
  const { currentPhase, setCurrentPhase } = usePhase();
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };
  if (currentPhase < phaseNumber) {
    LoggerService.error(
      "An redirect to a route out of bound of the current phase",
    );
    return (
      <Page className="flex flex-col justify-center items-center">
        <ErrorPage message="Page out of bound, please restart" />
        <Button onClick={handleReturn}>Return</Button>
      </Page>
    );
  }

  return <> {children} </>;
};

export default ProtectedRoute;
