import { useEffect, useState } from "react"
import BackOffice from "../../components/BackOffice"
import MyModal from "../../components/MyModal"
import Swal from "sweetalert2"
import axios from "axios"
import config from "../../config"

function Product() {

    const [product, setProduct] = useState({})
    const [products, setProducts] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const handleSave = async () => {
        try {
            product.img = ''
            product.price = parseInt(product.price)
            product.cost = parseInt(product.cost)
            const res = await axios.post(config.apiPath + '/product/create', product , config.headers)

            if(res.data.message === 'success'){
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 2000
                })
                document.getElementById('modalProduct_btnClose').click()
            }
        } catch(e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchData = async() => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers())

            if(res.data.results !== undefined) {
                setProducts(res.data.results)
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        })
    }

    return <BackOffice>
        <div className='h4'>Product</div>
        <button className="btn btn-primary" data-toggle='modal' data-target='#modalProduct' onClick={clearForm}>
            <i className="fa fa-plus"></i> เพิ่มรายการ
        </button>

        <MyModal id='modalProduct' title='สินค้า'>
            <div>
                <div>ชื่อสินค้า</div>
                <input className='form-control' value={product.name} onChange={e => setProduct({ ...product, name: e.target.value})} />
            </div>
            <div className="mt-3">
                <div>ราคาทุน</div>
                <input className='form-control' value={product.cost} onChange={e => setProduct({ ...product, cost: e.target.value})} />
            </div>
            <div className="mt-3">
                <div>ราคาขาย</div>
                <input className='form-control' value={product.price} onChange={e => setProduct({ ...product, price: e.target.value})} />
            </div>
            <div className="mt-3">
                <div>ภาพสินค้า</div>
                <input className='form-control' type='file'/>
            </div>
            <div className="mt-3">
                <button className='btn btn-primary' onClick={handleSave}>
                    <i className='fa fa-check mr-2'></i>
                </button>
            </div>
        </MyModal>
    </BackOffice>
}

export default Product