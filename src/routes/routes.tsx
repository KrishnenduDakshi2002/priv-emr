import Admin from "@/pages/admin/page";
import Doctor from "@/pages/doctor/page";
import Lab from "@/pages/lab/page";
import User from "@/pages/user/page";
import CreateEMRPage from "../pages/createEMR/page";
import MyEMRsPage from "../pages/my-emr/page";

export const routes = {
    '/admin': () => <Admin />,
    '/user' : () => <User />,
    '/doctor': () => <Doctor />,
    '/lab': () => <Lab />,
    '/create-emr': () => <CreateEMRPage />,
    '/my-emr': () => <MyEMRsPage />
};
