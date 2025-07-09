import { useEffect, useRef,useState } from "react"
import BackOffice from "../../components/BackOffice"
import MyModal from "../../components/MyModal"
import Swal from "sweetalert2"
import axios from "axios"
import config from "../../config"

function Product() {

    const [product, setProduct] = useState({})
    const [products, setProducts] = useState({})
    const [img, setImg] = useState({})
    const refImg = useRef()

    useEffect(() => {
        fetchData()
    }, [])

    const handleUploadFile = async () => {
        try {
            const formData = new FormData()
            formData.append('img', img)

            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if(res.data.newName !== undefined){
                return res.data.newName
            }
        } catch (e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })

            return ""
        }
    }

    const handleSave = async () => {
        try {
            product.img = await handleUploadFile()
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
        setImg(null)
        refImg.current.value = ''
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

    const selectedFile = (inputFile) => {
        if(inputFile !== undefined) {
            if(inputFile.length > 0) {
                setImg(inputFile[0])
            }
        }
    }

    const showImage = (item) => {
        if(item.img !== "") {
            return  <img alt="" className="img-fluid" src={config.apiPath + '/uploads/' + item.img} />
        }
        return <></>
    }

    return <BackOffice>
        <div className='h4'>Product</div>
        <button className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct' onClick={clearForm}>
            <i className="fa fa-plus mr-2"></i> เพิ่มรายการ
        </button>
        <button className="btn btn-success">
            <i className="fa fa-arrow-down mr-2"></i> Import from Excel
        </button>

        <table className="mt-3 table table-bordered table-striped">
            <thead>
                <tr>
                    <th width='150px'>ภาพสินค้า</th>
                    <th>name</th>
                    <th width='150px' className="text-right">cost</th>
                    <th width='150px' className="text-right">price</th>
                    <th width='140px'></th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map((item, key) => 
                    <tr key={key}>
                        <td>{showImage(item)}</td>
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
                <input className='form-control' type='file' ref={refImg} onChange={e => selectedFile(e.target.files)}/>
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