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
            let res
            if(product.id === undefined){
                res = await axios.post(config.apiPath + '/product/create', product , config.headers)
            }else{
                res = await axios.put(config.apiPath + '/product/update', product, config.headers())
            }
           

            if(res.data.message === 'success'){
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 2000
                })
                document.getElementById('modalProduct_btnClose').click()

                fetchData()

                setProduct({...product, id: undefined})
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

    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                text: 'remove tiem',
                title: 'remove',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if(button.isConfirmed){
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers)

                if (res.data.message === 'success'){
                    Swal.fire({
                        title: 'remove',
                        text: 'remove success',
                        icon: 'success',
                        timer: 2000
                    })

                    fetchData()
                }
            }
        } catch (e) {
             Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return <BackOffice>
        <div className='h4'>Product</div>
        <button className="btn btn-primary" data-toggle='modal' data-target='#modalProduct' onClick={clearForm}>
            <i className="fa fa-plus"></i> เพิ่มรายการ
        </button>

        <table className="mt-3 table table-bordered table-striped">
            <thead>
                <tr>
                    <th>name</th>
                    <th width='150px' className="text-right">cost</th>
                    <th width='150px' className="text-right">price</th>
                    <th width='140px'></th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map((item, key) => 
                    <tr key={key}>
                        <td>{item.name}</td>
                        <td className="text-right">{item.cost}</td>
                        <td className="text-right">{item.price}</td>
                        <td className="text-center">
                            <button className='btn btn-primary mr-2' data-toggle='modal' data-target='#modalProduct' onClick={e => setProduct(item)}><i className="fa fa-edit"></i></button>
                            <button className="btn btn-danger" onClick={e => handleRemove(item)}><i className='fa fa-times'></i></button>
                        </td>
                    </tr>
                ): <></>}
            </tbody>
        </table>

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