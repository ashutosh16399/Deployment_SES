import { Link } from "react-router-dom"

function PathHandler() {
    return (
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li class="breadcrumb-item"><Link to="/demo">Demo</Link></li>
                <li class="breadcrumb-item" aria-current="page">Data</li>
            </ol>
        </nav>
    )
}

export default PathHandler