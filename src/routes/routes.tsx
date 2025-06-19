import Admin from "@/pages/admin/page";
import Doctor from "@/pages/doctor/page";
import Lab from "@/pages/lab/page";
import User from "@/pages/user/page";

export const routes = {
    '/admin': () => <Admin />,
    '/user' : () => <User />,
    '/doctor': () => <Doctor />,
    '/lab': () => <Lab />
};
