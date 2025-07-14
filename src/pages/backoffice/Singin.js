import axios from "axios"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import config from '../../config'
import { useNavigate } from "react-router-dom"

function SingIn() {
    const [user, setUser] = useState({})
    const navigate = useNavigate()

    const handleSingIn = async () => {
        try {
            const res = await axios.post(config.apiPath + '/user/signIn', user)
            
            if(res.data.token !== undefined){
                localStorage.setItem('token', res.data.token)
                navigate('/dashboard')
            }
        } catch (e) {
            if(e.response.status === 401) {
                Swal.fire({
                    title: 'sing in',
                    text: 'username or password invalid',
                    icon: "warning"
                })
            }else{
                Swal.fire({
                    title: 'error',
                    text: e.message,
                    icon: 'error'
                })
            }
        }
    }

    useEffect(() => {checkSingIn()}, [])

    const checkSingIn = async() => {
        try {
            if(localStorage.getItem('token')){
                navigate('/dashboard')
            }
            else {
                navigate('/')
            }
        } catch (e) {
            console.log(e.message)
            navigate('/')
        }
    }

    return <div className="hold-transition login-page">
        <div class="login-box">
            <div class="login-logo">
                <a href=""><b>Ecommer BackOffice</b></a>
            </div>
            <div class="card">
                <div class="card-body login-card-body">
                    <p class="login-box-msg">Sign in to start your session</p>

                    <div >
                        <div class="input-group mb-3">
                            <input type="email" class="form-control" placeholder="Email" onChange={e => setUser({...user, user: e.target.value})}/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                        <div class="input-group mb-3">
                            <input type="password" class="form-control" placeholder="Password" onChange={e => setUser({...user, pass: e.target.value})}/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary btn-block" onClick={handleSingIn}>Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default SingIn