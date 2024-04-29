import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import  Axios from "axios";

function App() {
  const baseUrl="http://localhost:8080/terminal2/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]=useState({
    id: '',
    placa: '',
    marca: '',
    modelo: '',
    numasientos: '',
    procedencia: ''
    
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditarr=()=>{
    setModalEditar(!modalInsertar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await Axios.get(baseUrl)
    .then(Response=>{
      //console.log((Response.data));
      setData(Response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("placa", frameworkSeleccionado.placa);
    f.append("marca", frameworkSeleccionado.marca);
    f.append("modelo", frameworkSeleccionado.modelo);
    f.append("numasientos", frameworkSeleccionado.numasientos);
    f.append("procedencia", frameworkSeleccionado.procedencia);
    f.append("METHOD", "POST");
    await Axios.post(baseUrl, f)
    .then(Response=>{
      setData(data.concat(Response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("placa", frameworkSeleccionado.placa);
    f.append("marca", frameworkSeleccionado.marca);
    f.append("modelo", frameworkSeleccionado.modelo);
    f.append("numasientos", frameworkSeleccionado.numasientos);
    f.append("procedencia", frameworkSeleccionado.procedencia);
    f.append("METHOD", "PUT");
    await Axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(Response=>{
      var dataNueva= data;
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.placa=frameworkSeleccionado.placa;
          framework.marca=frameworkSeleccionado.marca;
          framework.modelo=frameworkSeleccionado.modelo;
          framework.numasientos=frameworkSeleccionado.numasientos;
          framework.procedencia=frameworkSeleccionado.procedencia;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditarr();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await Axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(Response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);
    (caso==="Editar")?
    abrirCerrarModalEditarr():
    abrirCerrarModalEliminar()
    //:null
    
  }

  useEffect(()=>{
    peticionGet();
  },[])
  return (
    <div >
      <h1>Terminal</h1>
    
      <br />
        <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>PLACA</th>
            <th>MARCA</th>
            <th>MODELO</th>
            <th>NUMASIENTOS</th>
            <th>PROCEDENCIA</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
        {data.map(framework=>(
        <tr key={framework.id}>
          <td>{framework.id}</td>
          <td>{framework.placa}</td>
          <td>{framework.marca}</td>
          <td>{framework.modelo}</td>
          <td>{framework.numasientos}</td>
          <td>{framework.procedencia}</td>
          <td>
            <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button> {"  "}
            <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
          </td>
        </tr>
      ))}
        </tbody>
      </table>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertrar Bus</ModalHeader>
        <ModalBody>
          <div className="form-droup">
            <label>PLACA: </label>
            <br />
            <input type="text" className="form-control" name="placa" onChange={handleChange}/>
            <br />
            <label>MARCA: </label>
            <br />
            <input type="text" className="form-control" name="marca" onChange={handleChange}/>
            <br />
            <label>MODELO: </label>
            <br />
            <input type="text" className="form-control" name="modelo" onChange={handleChange}/>
            <label>N. ASIENTOS: </label>
            <br />
            <input type="text" className="form-control" name="numasientos" onChange={handleChange}/>
            <label>PROCEDENCIA: </label>
            <br />
            <input type="text" className="form-control" name="procedencia" onChange={handleChange}/>
            
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Bus</ModalHeader>
        <ModalBody>
          <div className="form-droup">
            <label>PLACA: </label>
            <br />
            <input type="text" className="form-control" name="placa" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.placa}/>
            <br />
            <label>MARCA: </label>
            <br />
            <input type="text" className="form-control" name="marca" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.marca}/>
            <br />
            <label>MODELO: </label>
            <br />
            <input type="text" className="form-control" name="modelo" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.modelo}/>
            <label>N. ASIENTOS: </label>
            <br />
            <input type="text" className="form-control" name="numasientos" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.numasientos}/>
            <label>PROCEDENCIA: </label>
            <br />
            <input type="text" className="form-control" name="procedencia" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.procedencia}/>
            
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditarr()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
         ¿Estas seguro que deseas eliminar el Bus {frameworkSeleccionado && frameworkSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>Si</button>
          <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar}>No</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;

