import { Link, useRouteError } from 'react-router-dom'
import Nav from '../components/Nav'
import Button from '../components/Button'


const ErrorPage = () => {
    const error = useRouteError()
    return (
        <div>
            <Nav />
            <main className=' text-center'>
                <h2 className=' text-xl font-semibold mb-1'>{error.message ? 'An error occured':'Not Found'}</h2>
                <span className='text-lg'>{error.message || 'We couldn’t find the page you are looking for'}</span>
                <p><Link to={'/'}><Button classes='bg-black hover:bg-rose-600 text-white mt-4'>Go to Homepage</Button></Link></p>
            </main>
        </div>
    )
}

export default ErrorPage
