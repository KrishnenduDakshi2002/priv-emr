import Admin from "@/pages/admin/page";
import Doctor from "@/pages/doctor/page";
import Lab from "@/pages/lab/page";
import User from "@/pages/user/page";
import HomePage from "@/pages/home/page";
import CreateEMRPage from "../pages/createEMR/page";
import MyEMRsPage from "../pages/my-emr/page";
import MyEMRsMainPage from "../pages/my-emrs-main/page";
import ShareEMRPage from "../pages/share-emr/page";
import MyProofsPage from "../pages/my-proofs/page";
import GenerateProofPage from "../pages/generate-proof/page";
import VerifyProofPage from "../pages/verify-proof/page";
import DoctorDashboardPage from "../pages/doctor-dashboard/page";
import DoctorRequestsPage from "../pages/doctor-requests/page";
import DoctorEMRsPage from "../pages/doctor-emrs/page";
import DoctorRequestAccessPage from "../pages/doctor-request-access/page";
import ShareProofPage from "../pages/share-proof/page";

export const routes = {
  "/": () => <HomePage />,
  "/admin": () => <Admin />,
  "/user": () => <User />,
  "/doctor": () => <Doctor />,
  "/lab": () => <Lab />,
  "/create-emr": () => <CreateEMRPage />,
  "/my-emr": () => <MyEMRsPage />,

  // Primary Features
  "/my-emrs": () => <MyEMRsPage />,
  "/my-emrs-main": () => <MyEMRsMainPage />,
  "/share-emr": () => <ShareEMRPage />,
  "/my-proofs": () => <MyProofsPage />,
  // Note: '/activity-log' - no corresponding page found

  // ZK Proof Features
  "/generate-proof": () => <GenerateProofPage />,
  "/share-proof": () => <ShareProofPage />,
  "/verify-proof": () => <VerifyProofPage />,

  // Doctor Features
  "/doctor-dashboard": () => <DoctorDashboardPage />,
  "/doctor-requests": () => <DoctorRequestsPage />,
  "/doctor-emrs": () => <DoctorEMRsPage />,
  "/doctor-request-access": () => <DoctorRequestAccessPage />,
};
