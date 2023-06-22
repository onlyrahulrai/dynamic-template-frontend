import React from 'react'
import { useLocation,  useParams,useSearchParams } from 'react-router-dom'
import useAuthStore from '../state/useAuthStore';

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        const location = useLocation();
        const params = useParams();
        const [searchParams,] = useSearchParams();

        const store = useAuthStore((state) => state)

        return <Component {...props} {...{ location, params,searchParams,store }} />;
    }

    return ComponentWithRouterProp;
}

export default withRouter;
