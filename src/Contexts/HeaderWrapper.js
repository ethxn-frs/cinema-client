import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PublicHeaderComponent from '../components/Header/PublicHeaderComponent';
import HeaderComponent from '../components/Header/HeaderComponent';

function HeaderWrapper() {
    const location = useLocation();
    const publicRoutes = ['/signup', '/login'];

    if (publicRoutes.includes(location.pathname)) {
        return <PublicHeaderComponent />;
    } else {
        return <HeaderComponent />;
    }
}

export default HeaderWrapper