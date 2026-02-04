import { useRouteError } from "react-router-dom";

export const NotFound = () => {
    const error = useRouteError();
    return (
        <div>
            <h1>ページが見つかりません</h1>
            <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
    );
}