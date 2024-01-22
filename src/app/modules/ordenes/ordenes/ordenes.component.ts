import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Observable, catchError, exhaustMap, finalize, map, of, throwError } from 'rxjs';
import { CreacionOrdenesService } from 'src/app/services/creacion-ordenes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

@ViewChild('dt') dt!: Table;

@ViewChild('dt') mc01Table!: Table;   

@ViewChild('tuTabView') tabView: any;
 globalFilterMC01: string = ''; 
 
 ingredient: any = 'SC';
 TipoExistencia:any = null;
 TipoExistencia1:boolean = true;
 
 checked: boolean = true;
 cities!: any[];
 searchText: string = '';

 isSubmitting: boolean = false;
 
 submitted: boolean = false;

 productDialog: boolean = false;
 terceros:boolean=false;
 recomendaciones:boolean = false;
 refacciones: boolean = false;
 cotizaciones:boolean= false
 manoDeObra:boolean = false;
 manoDeObraTecnicos: boolean = false
 product!: any;
 productos!: any[];
 selectedCity: any;
 data: any[] = [];
 products!: any[];
 tiposTrabajo: any[] = [];
 listaSeries:any[]=[];
 listaSeries1:any[]=[];
 listaCordinadores: any[]=[];
 listaTecnicos:any[]=[];
 listaTrabajos:any[]=[];
 listaFallos:any[]=[];

 datosGrabados:any[]=[];

 miFormulario!: FormGroup;

 filtroGlobal: string = '';

dropdownWidth: string = '20rem';
dropdownWidth1: string = '15rem';
dropdownWidth2:string = '5rem'
dropdownWidth3: string='8rem'
dropdownWidth4: string='10rem'
selectedSeries: any;

tipoSeleccionado: string | undefined;

detallesCotizacionAsociados: any[]=[] ;
opcionSeleccionada: any | null = null;

cotizacionSeleccionada: any;
detallesCotizacionSeleccionada: any[]=[];

isBT01Selected: boolean = false;
isMC01Selected: boolean = false;

visibleBT01Modal: boolean = false;
visibleMC01Modal: boolean = false;

selectedTipo!: string;
bt01Data: any[] = [];
mc01Data: any[] = [];
bt01DataArray: any[] = [];
mc01DataArray: any[] = [];
dAdicionales:any={};
SerieAlmacen:any[]=[]
dRefacciones:any[]= [];
dCotizaciones:any[]=[];
dDetallesCotizaciones:any[]=[];
selectedRowData: any;

selectedProduct: any;

clienteProp: string = '';
nombreProp: string = '';
direccionProp: string = '';
ciudad:string ='';
ciudadProp:string = '';
otroInput: string = '';

valorActual: any;

elementosTabla: any[]=[
  {tipo:null, U_NReparto:'', U_NumEcon:'', U_GoodsBrand:'', U_GoodsModel:'',U_GoodsSerial:'', U_OdoAct:'', U_OdomNue:''},
]

elementosTablaRefacciones:any[]=[
  {NoParte:'', Descripcion:'', Cantidad:'', CC:'', SC:'',U_GoodsSerial:'', Almacen:'', Existencia:'',original: true }
]

selectedU_NReparto: any = '';

select:any='';

prioridades: any[] = [
  { label: 'Alta', value: 'A' },
  { label: 'Normal', value: 'N' },
  { label: '-', value: '-' },
];

estados:any[]=[
  
  {label:'Diagnóstico', value:'D'},
  {label:'Cotización', value: 'C'},
  {label:'Terminar', value:'T'}
]

original!: boolean;

indiceActivo: number = 0;
tabIndex!: number;
diagnosticoHabilitado: boolean = true;
refaccionesHabilitado: boolean = true;
manoDeObraHabilitado: boolean = true;
tercerosHabilitado: boolean = true;
recomendacionesHbilitado:boolean= true;
anexosHabilitado:boolean= true
panelActivo: string = 'diagnosticoPanel';

almacenSeleccionado: any | undefined;
opcionesCotizaciones: string[] = [];
compararAlmacen:any

cardcode: string = '';

cotizacionSeleccionadaDocEntry: number | undefined;


//Mano de obra 
dManoDeObra:any[]=[];
elementosTablaManoDeObra:any[]=[
  {Articulos:'', Nombres:'', Horas: '', Cantidad:'', Tecnico:'', Nombre:'',Fecha:'', HReales:'', Ejecutada:'' }
]

ultimaPosicionCreada: number = -1;

dTerceros:any[]=[];
dProveedores:any[]=[];
dOrdenCompra:any[]=[];
ordenesCompraAsociadas:any[]=[]
ordenCompra: boolean= false
elementosTablaTerceros:any[]=[
    {Proveedor:'', Nombre:'', OrdenCompra: '', Total:''}
]

dRecomendaciones:any[]=[];
elementosTablaRecomendaciones:any[]=[
  {NoParte:'', Descripcion:'', Cantidad: ''}
]


fechaSeleccionadatablas: Date = new Date();
datos:any[]=[]

selectedOrden: any; // Definir el tipo adecuado según la estructura de tus órdenes
ordenes: any[]=[];

modoEdicion = false;
docEntry: number | null = null;
constructor(private creacionOrdenesService:CreacionOrdenesService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute){}


  ngOnInit(): void {

    
    this.route.params.subscribe(params => {
      this.docEntry = params['docEntry'];
    
      if (this.docEntry) {
        this.modoEdicion = true;
        // Estás editando, llama al servicio para obtener detalles y actualiza tu formulario
/*
        this.creacionOrdenesService.obtenerDetalleOrden(docEntry).subscribe(
          (response: any) => {
            if (response && response.data) {
              // Actualiza tu formulario con los detalles de la orden
              const datosMapeados = {
                tipoTrabajo: response.data.U_TipTra,
                selectedSeries: response.data.U_Series,
                otroInput: response.data.U_OtroInput,
                selectedSeriesInput: response.data.U_DocNum,
                selectedFallos: response.data.U_CodFall,
                reportadoPor: response.data.U_PerRep,
                autorizadoPor: response.data.U_PerAut,
                fueraDeServicio: response.data.U_FueSer,
                prioridadSeleccionada: response.data.U_Prior,
                fechaSeleccionada: new Date(response.data.U_DocDate),
                estadoSeleccionado: response.data.U_Status,
                seleccionAgente: response.data.U_AgVent,
                seleccionTecnico: response.data.U_TecResp,
                seleccionCoordinador: response.data.U_Coord,
                seleccionarFormato: response.data.U_ComTra,
                dropdownCotizaciones: response.data.U_DocCot,
                U_ProRep: response.data.U_ProRep,
                cliente: response.data.U_CardCode,
                nombre: response.data.U_CardName,
                direccion: response.data.U_Address,
                ciudad: response.data.U_City,
                telefono: response.data.U_Phone,
                contrato: response.data.U_OrdCom,
                textoDiagnostico: response.data.U_ComTra,
                // ... continua mapeando las demás propiedades ...


              };
              this.miFormulario.patchValue(datosMapeados);
   
               
              if (response.data.DVP_WOR7Collection && Array.isArray(response.data.DVP_WOR7Collection) && response.data.DVP_WOR7Collection.length > 0) {
                this.elementosTabla = [{
                  //tipo: response.data.tipoEquipoNombre,
                  U_TipEqu: response.U_TipEqu,
                  U_NumEcon: response.data.DVP_WOR7Collection[0].U_NumEcon,
                  U_NReparto: response.data.DVP_WOR7Collection[0].U_NorRep,
                  U_GoodsBrand: response.data.DVP_WOR7Collection[0].U_Marca,
                  U_GoodsModel: response.data.DVP_WOR7Collection[0].U_Modelo,
                  U_GoodsSerial: response.data.DVP_WOR7Collection[0].U_Serie,
                  U_OdoAct: response.data.DVP_WOR7Collection[0].U_OdomAct,
                  U_OdomNue: response.data.DVP_WOR7Collection[0].U_OdomNue !== undefined ? response.data.DVP_WOR7Collection[0].U_OdomNue : null,
                }];
                if (this.elementosTabla.length > 0) {
                  this.miFormulario.controls['U_OdomNue'].setValue(this.elementosTabla[0].U_OdomNue);
                }
              }

              
              

              console.log('Carga de datos', response.data);
            } else {
              console.error('La respuesta no tiene la estructura esperada', response);
              // Puedes manejar el caso en el que la respuesta no tenga la estructura esperada
            }
          },
          error => {
            console.error('Error al obtener detalles de la orden para editar', error);
            // Puedes manejar el error según tus necesidades
          }
        );*/

        this.cargarDatosOrden(this.docEntry)
      }
    });
    

    this.cargarDatos();
    this.cargarDatosBT01();
    this.cargarDatosMC01();
    this.cargarDatosRefacciones();
    this.selectedSeries = null;
   
    this.cargarDatosManoDeObra();
    this.cargarDatosProveedoresTerceros()
   // this.cargarDatosOrdenTerceros()
    this.cargarDatosRecomendaciones()


    this.miFormulario = this.fb.group({
      tipoTrabajo: [''], 
      selectedSeries: [''],
      otroInput: [''],
      selectedSeriesInput: [''],
      selectedFallos:[''],
      reportadoPor:[''],
      autorizadoPor:[''],
      fueraDeServicio: [''],
      prioridadSeleccionada:['A'],
      fechaSeleccionada: [new Date()],
      estadoSeleccionado:['D'],
      seleccionAgente:[''],
      seleccionTecnico: [''],
      seleccionCoordinador: [''],
      seleccionarFormato: [''],
      textoDiagnostico:[''],
      listaTrabajos:[''],
      dropdownCotizaciones: [''],
      U_ProRep:[''],
      cliente: [''],
      nombre: [''],
      direccion: [''],
      ciudad: [''],
      telefono: [''],
      contrato: [''],
     // ocOt: [''],
     U_OdomNue:[null],
     U_TipEqu:[''],
     elementosTabla: this.fb.array([]),

   
    });

    this.valorActual = this.miFormulario.value.tipoTrabajo;
    this.actualizarIndiceActivo();
    this.onEstadoSeleccionadoChange1({ value: 'D' });  
    
  }

  
  private cargarDatosOrden(docEntry: number): void {
    // Llama al servicio para obtener detalles y actualiza tu formulario
    this.creacionOrdenesService.obtenerDetalleOrden(docEntry).subscribe(
      (response: any) => {
        if (response && response.data) {
          // Actualiza tu formulario con los detalles de la orden
          const datosMapeados = {
            tipoTrabajo: response.data.U_TipTra,
            selectedSeries: response.data.U_Series,
            otroInput: response.data.U_OtroInput,
            selectedSeriesInput: response.data.U_DocNum,
            selectedFallos: response.data.U_CodFall,
            reportadoPor: response.data.U_PerRep,
            autorizadoPor: response.data.U_PerAut,
            fueraDeServicio: response.data.U_FueSer,
            prioridadSeleccionada: response.data.U_Prior,
            fechaSeleccionada: new Date(response.data.U_DocDate),
            estadoSeleccionado: response.data.U_Status,
            seleccionAgente: response.data.U_AgVent,
            seleccionTecnico: response.data.U_TecResp,
            seleccionCoordinador: response.data.U_Coord,
            seleccionarFormato: response.data.U_ComTra,
            dropdownCotizaciones: response.data.U_DocCot,
            U_ProRep: response.data.U_ProRep,
            cliente: response.data.U_CardCode,
            nombre: response.data.U_CardName,
            direccion: response.data.U_Address,
            ciudad: response.data.U_City,
            telefono: response.data.U_Phone,
            contrato: response.data.U_OrdCom,
            textoDiagnostico: response.data.U_ComTra,
            // ... continua mapeando las demás propiedades ...

          };
          this.miFormulario.patchValue(datosMapeados);

          if (response.data.DVP_WOR7Collection && Array.isArray(response.data.DVP_WOR7Collection) && response.data.DVP_WOR7Collection.length > 0) {
            this.elementosTabla = [{
              U_TipEqu: response.data.DVP_WOR7Collection[0].U_TipEqu,
              U_NumEcon: response.data.DVP_WOR7Collection[0].U_NumEcon,
              U_NReparto: response.data.DVP_WOR7Collection[0].U_NorRep,
              U_GoodsBrand: response.data.DVP_WOR7Collection[0].U_Marca,
              U_GoodsModel: response.data.DVP_WOR7Collection[0].U_Modelo,
              U_GoodsSerial: response.data.DVP_WOR7Collection[0].U_Serie,
              U_OdoAct: response.data.DVP_WOR7Collection[0].U_OdomAct,
              U_OdomNue: response.data.DVP_WOR7Collection[0].U_OdomNue !== undefined ? response.data.DVP_WOR7Collection[0].U_OdomNue : null,
            }];
            if (this.elementosTabla.length > 0) {
              this.miFormulario.controls['U_OdomNue'].setValue(this.elementosTabla[0].U_OdomNue);
            }
          }

          console.log('Carga de datos', response.data);
        } else {
          console.error('La respuesta no tiene la estructura esperada', response);
          // Puedes manejar el caso en el que la respuesta no tenga la estructura esperada
        }
      },
      error => {
        console.error('Error al obtener detalles de la orden para editar', error);
        // Puedes manejar el error según tus necesidades
      }
    );
  }
  
  grabarOrden() {
    
    if (this.isSubmitting) {
      return;
    }
  
    // Deshabilita el botón para evitar múltiples envíos
    this.isSubmitting = true;
    // Muestra los valores del formulario en la consola
    const valoresFormulario = this.miFormulario.value;
    console.log('Valores del formulario', valoresFormulario);
  
    const tipoEquipoSeleccionado = this.miFormulario.get('U_TipEqu')?.value;
    const tipoEquipoNombre = tipoEquipoSeleccionado ? tipoEquipoSeleccionado.Code : '';
   console.log('nombre del equipo', tipoEquipoNombre)

   const dvpWor7Collection = this.elementosTabla.map((orden, index) => ({
    LineId: index,
    U_TipEqu: tipoEquipoNombre,
    U_NumEcon: orden.U_NumEcon,
    U_NorRep: orden.U_NReparto,
    U_Marca: orden.U_GoodsBrand,
    U_Modelo: orden.U_GoodsModel,
    U_Serie: orden.U_GoodsSerial,
    U_OdomAct: orden.U_OdoAct,
    U_OdomNue: orden.U_OdomNue !== undefined ? orden.U_OdomNue : this.miFormulario.get('U_OdomNue')?.value,
    
  }));

    // Crea el objeto con la estructura requerida para el API
    const bodyParaAPI = {
      DocEntry: 64,
      DocNum: 64,
      Series: -1,
      U_LastPref: null,
      U_ConFlo: null,
      U_DocNum: valoresFormulario.selectedSeriesInput,
      U_Series: valoresFormulario.selectedSeries,
      U_Prefix: null,
      U_TipTra: valoresFormulario.tipoTrabajo,
      U_RefOrdTra: null,
      U_CardCode: valoresFormulario.cliente,
      U_CardName: valoresFormulario.nombre,
      U_Address: valoresFormulario.direccion,
      U_City: valoresFormulario.ciudad,
      U_Phone: valoresFormulario.telefono,
      U_OrdCom: null,
      U_PDFOC: null,
      U_NomSysOC: null,
      U_Status: valoresFormulario.estadoSeleccionado,
      U_DocDate: valoresFormulario.fechaSeleccionada.toISOString(),
      U_FecEspPar: null,
      U_Prior: valoresFormulario.prioridadSeleccionada,
      U_AgVent: valoresFormulario.seleccionAgente,
      U_NomAgVent: null, // Ajusta según tu lógica
      U_PerAut: valoresFormulario.autorizadoPor,
      U_PerRep: valoresFormulario.reportadoPor,
      U_CodFall: valoresFormulario.selectedFallos,
      U_ProRep: valoresFormulario.U_ProRep,
      U_ComTra: valoresFormulario.textoDiagnostico,
      U_ComRec: null,
      U_ComRef: null,
      U_ComMan: null,
      U_ComRep: null,
      U_Com: null,
      U_ComClosed: null,
      U_TipEqu: null,
      U_NumEcon: null,
      U_Marca: null,
      U_Modelo: null,
      U_Serie: null,
      U_Closed: null,
      U_Ended: null,
      U_Odom: null,
      U_EndRec: null,
      U_StartD: null,
      U_EndD: null,
      U_HasD: null,
      U_HorasMan: null,
      U_StartC: null,
      U_EndC: null,
      U_HasC: null,
      U_StartA: null,
      U_EndA: null,
      U_HasA: null,
      U_StartP: null,
      U_EndP: null,
      U_HasP: null,
      U_StartE: null,
      U_EndE: null,
      U_HasE: null,
      U_DocT: null,
      U_DocR: null,
      U_DocCot: null,
      U_DocFac: null,
      U_EnTras: null,
      U_FueSer: null,
      U_NorRep: null,
      U_TecResp: valoresFormulario.seleccionTecnico,
      U_Coord: valoresFormulario.seleccionCoordinador,
      U_ManObrCap: null,
      DVP_WOR1Collection: null,
      DVP_WOR2Collection: null,
      DVP_WOR3Collection: null,
      DVP_WOR4Collection: null,
      DVP_WOR5Collection: null,
      DVP_WOR6Collection: null,
      //DVP_WOR7Collection: dvpWor7Collection,
      DVP_WOR7Collection: []= [{
        LineId: 1, // Asegura que LineId sea único
        U_TipEqu:tipoEquipoNombre,
        U_NumEcon: this.elementosTabla[0].U_NumEcon,
        U_NorRep: this.elementosTabla[0].U_NReparto,
        U_Marca: this.elementosTabla[0].U_GoodsBrand,
        U_Modelo: this.elementosTabla[0].U_GoodsModel,
        U_Serie: this.elementosTabla[0].U_GoodsSerial,
        U_OdomAct: this.elementosTabla[0].U_OdoAct,
        U_OdomNue: this.elementosTabla[0].U_OdomNue !== undefined ? this.elementosTabla[0].U_OdomNue : this.miFormulario.get('U_OdomNue')?.value,
      }],
    };

   
    console.log('Valores mandados al api', bodyParaAPI);
    // Llama al servicio para guardar los datos en el API
    const jsonBody = JSON.stringify(bodyParaAPI);
  console.log(jsonBody)

  
      this.creacionOrdenesService.grabarOrdenTrabajo(bodyParaAPI)
      .subscribe(
        response => {
          console.log('Respuesta del API', response);
          Swal.fire({
            title: "Exito",
            text: "OT Grabado con Exito",
            icon: "success"
          });
        },
        
        error => {
          console.error('Error al llamar al API', error);
          Swal.fire({
            title: "Error",
            text: "Error al llamar al API",
            icon: "error"
          });
        }
      ) .add(() => {
        // Habilita el botón después de que la solicitud ha terminado (ya sea con éxito o con error)
        this.isSubmitting = false;

        //this.miFormulario.reset()
      });
    //this.miFormulario.reset()

  }
  


  onSubmit(): void {
    if (this.modoEdicion) {
      this.actualizarOrden();
    } else {
      this.grabarOrden();
    }
  }



  actualizarOrden() {
    if (this.docEntry !== null) {

    const valoresFormulario = this.miFormulario.value;
    //console.log('Valores enviados para edicion', valoresFormulario)
    const tipoEquipoNombre = this.elementosTabla[0]?.U_TipEqu || '';
    console.log(tipoEquipoNombre)
    
    const bodyParaActualizacion = {
      DocEntry: this.docEntry,
      DocNum: this.docEntry,
      Series: -1,
      U_LastPref: null,
      U_ConFlo: null,
      U_DocNum: valoresFormulario.selectedSeriesInput,
      U_Series: valoresFormulario.selectedSeries,
      U_Prefix: null,
      U_TipTra: valoresFormulario.tipoTrabajo,
      U_RefOrdTra: null,
      U_CardCode: valoresFormulario.cliente,
      U_CardName: valoresFormulario.nombre,
      U_Address: valoresFormulario.direccion,
      U_City: valoresFormulario.ciudad,
      U_Phone: valoresFormulario.telefono,
      U_OrdCom: null,
      U_PDFOC: null,
      U_NomSysOC: null,
      U_Status: valoresFormulario.estadoSeleccionado,
      U_DocDate: valoresFormulario.fechaSeleccionada.toISOString(),
      U_FecEspPar: null,
      U_Prior: valoresFormulario.prioridadSeleccionada,
      U_AgVent: valoresFormulario.seleccionAgente,
      U_NomAgVent: null, // Ajusta según tu lógica
      U_PerAut: valoresFormulario.autorizadoPor,
      U_PerRep: valoresFormulario.reportadoPor,
      U_CodFall: valoresFormulario.selectedFallos,
      U_ProRep: valoresFormulario.U_ProRep,
      U_ComTra: valoresFormulario.textoDiagnostico,
      U_ComRec: null,
      U_ComRef: null,
      U_ComMan: null,
      U_ComRep: null,
      U_Com: null,
      U_ComClosed: null,
      U_TipEqu: null,
      U_NumEcon: null,
      U_Marca: null,
      U_Modelo: null,
      U_Serie: null,
      U_Closed: null,
      U_Ended: null,
      U_Odom: null,
      U_EndRec: null,
      U_StartD: null,
      U_EndD: null,
      U_HasD: null,
      U_HorasMan: null,
      U_StartC: null,
      U_EndC: null,
      U_HasC: null,
      U_StartA: null,
      U_EndA: null,
      U_HasA: null,
      U_StartP: null,
      U_EndP: null,
      U_HasP: null,
      U_StartE: null,
      U_EndE: null,
      U_HasE: null,
      U_DocT: null,
      U_DocR: null,
      U_DocCot: null,
      U_DocFac: null,
      U_EnTras: null,
      U_FueSer: null,
      U_NorRep: null,
      U_TecResp: valoresFormulario.seleccionTecnico,
      U_Coord: valoresFormulario.seleccionCoordinador,
      U_ManObrCap: null,
      DVP_WOR1Collection: null,
      DVP_WOR2Collection: null,
      DVP_WOR3Collection: null,
      DVP_WOR4Collection: null,
      DVP_WOR5Collection: null,
      DVP_WOR6Collection: null,
      //DVP_WOR7Collection: dvpWor7Collection,
      DVP_WOR7Collection: []= [{
        LineId: 1, // Asegura que LineId sea único
        //U_TipEqu:this.elementosTabla[0].U_TipEqu,
        U_TipEqu:tipoEquipoNombre,
        U_NumEcon: this.elementosTabla[0].U_NumEcon,
        U_NorRep: this.elementosTabla[0].U_NReparto,
        U_Marca: this.elementosTabla[0].U_GoodsBrand,
        U_Modelo: this.elementosTabla[0].U_GoodsModel,
        U_Serie: this.elementosTabla[0].U_GoodsSerial,
        U_OdomAct: this.elementosTabla[0].U_OdoAct,
        U_OdomNue: this.elementosTabla[0].U_OdomNue !== undefined ? this.elementosTabla[0].U_OdomNue : this.miFormulario.get('U_OdomNue')?.value,
      }],
    };
    

    console.log('body para actualizacion', bodyParaActualizacion)
    const jsonBody = JSON.stringify(bodyParaActualizacion);
    console.log(jsonBody)
    // Llama al servicio para actualizar la orden
    this.creacionOrdenesService.updateOrden(bodyParaActualizacion).subscribe(
      response => {
        console.log('Respuesta del API al actualizar la orden', response);
        
        // Puedes mostrar un mensaje de éxito si lo deseas
        Swal.fire({
          title: "Exito",
          text: "OT actualizado con Exito",
          icon: "success"
        });
        
      },
      error => {
        console.error('Error al actualizar la orden', error);
        // Puedes manejar el error según tus necesidades
      }
    );
    
  }else {
    console.error('No se pudo obtener un valor válido de DocEntry');
    // Puedes manejar el caso en el que no se pueda obtener DocEntry
  }
}
  


  actualizarDatosTablaOrdenes(nuevosDatos: any) {
    // Asegúrate de tener acceso a la lista de órdenes que llena la tabla
    // Actualiza los datos en la lista (this.ordenes) con los nuevosDatos recibidos del API
    // Esto dependerá de cómo esté implementada tu lógica para mostrar las órdenes en la tabla
    // Por ejemplo:
    const indiceOrden = this.ordenes.findIndex(orden => orden.DocEntry === nuevosDatos.DocEntry);
    if (indiceOrden !== -1) {
      this.ordenes[indiceOrden] = nuevosDatos;
      
    }
  }

  /*
  onSubmit() {
    if (this.isSubmitting) {
      return;
    }
  
    this.isSubmitting = true;
  
    const valoresFormulario = this.miFormulario.value;
    console.log('Valores del formulario', valoresFormulario);
  
    const bodyParaAPI = {
      DocEntry: 64,
      DocNum: 64,
      Series: -1,
      U_LastPref: null,
      U_ConFlo: null,
      U_DocNum: valoresFormulario.selectedSeriesInput,
      U_Series: valoresFormulario.selectedSeries,
      U_Prefix: null,
      U_TipTra: valoresFormulario.tipoTrabajo,
      U_RefOrdTra: null,
      U_CardCode: valoresFormulario.cliente,
      U_CardName: valoresFormulario.nombre,
      U_Address: valoresFormulario.direccion,
      U_City: valoresFormulario.ciudad,
      U_Phone: valoresFormulario.telefono,
      U_OrdCom: null,
      U_PDFOC: null,
      U_NomSysOC: null,
      U_Status: valoresFormulario.estadoSeleccionado,
      U_DocDate: valoresFormulario.fechaSeleccionada.toISOString(),
      U_FecEspPar: null,
      U_Prior: valoresFormulario.prioridadSeleccionada,
      U_AgVent: valoresFormulario.seleccionAgente,
      U_NomAgVent: null, // Ajusta según tu lógica
      U_PerAut: valoresFormulario.autorizadoPor,
      U_PerRep: valoresFormulario.reportadoPor,
      U_CodFall: valoresFormulario.selectedFallos,
      U_ProRep: valoresFormulario.U_ProRep,
      U_ComTra: null,
      U_ComRec: null,
      U_ComRef: null,
      U_ComMan: null,
      U_ComRep: null,
      U_Com: null,
      U_ComClosed: null,
      U_TipEqu: null,
      U_NumEcon: null,
      U_Marca: null,
      U_Modelo: null,
      U_Serie: null,
      U_Closed: null,
      U_Ended: null,
      U_Odom: null,
      U_EndRec: null,
      U_StartD: null,
      U_EndD: null,
      U_HasD: null,
      U_HorasMan: null,
      U_StartC: null,
      U_EndC: null,
      U_HasC: null,
      U_StartA: null,
      U_EndA: null,
      U_HasA: null,
      U_StartP: null,
      U_EndP: null,
      U_HasP: null,
      U_StartE: null,
      U_EndE: null,
      U_HasE: null,
      U_DocT: null,
      U_DocR: null,
      U_DocCot: null,
      U_DocFac: null,
      U_EnTras: null,
      U_FueSer: null,
      U_NorRep: null,
      U_TecResp: valoresFormulario.seleccionTecnico,
      U_Coord: valoresFormulario.seleccionCoordinador,
      U_ManObrCap: null,
      DVP_WOR1Collection: null,
      DVP_WOR2Collection: null,
      DVP_WOR3Collection: null,
      DVP_WOR4Collection: null,
      DVP_WOR5Collection: null,
      DVP_WOR6Collection: null,
      DVP_WOR7Collection: [
        {
          LineId: 1,
          U_TipEqu: "MC01",
          U_NumEcon: "bds8888",
          U_NorRep: "jhgh555",
          U_Marca: "BOSH",
          U_Modelo: "BSH547",
          U_Serie: "557896",
          U_OdomAct: 21,
          U_OdomNue: 22
        }
      ]
    };
  
    console.log('Valores mandados al API', bodyParaAPI);
  
    this.creacionOrdenesService.grabarOrdenTrabajo(bodyParaAPI)
      .pipe(
        exhaustMap(response => {
          console.log('Respuesta del API', response);
          Swal.fire({
            title: "Éxito",
            text: "OT Grabado con Éxito",
            icon: "success"
          });
          // Puedes retornar un observable vacío o con algún valor si es necesario
          return of(null);
        }),
        catchError(error => {
          console.error('Error al llamar al API', error);
          Swal.fire({
            title: "Error",
            text: "Error al llamar al API",
            icon: "error"
          });
          // Puedes retornar un observable vacío o con algún valor si es necesario
          return throwError(error);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe();
  }*/



  

  cargarDatos() {
    this.creacionOrdenesService.listarCombos().subscribe(
      (response) => {
        if (response.ResultCode === 0 && response.data) {
          this.data = response.data;
          console.log(response.data);
          this.tiposTrabajo = response.data.listaTipos;
          this.listaSeries = response.data.listaSeries;
          console.log('Lista de Series:', this.listaSeries);
          this.listaCordinadores = response.data.listaCordinadores;
          //console.log(response.data.listaCordinadores);
          this.listaTecnicos = response.data.listaTecnicos;

          console.log('Esta es la lista de los tecnicos', this.listaTecnicos)
          this.listaTrabajos = response.data.listaTrabajos;
          this.listaFallos = response.data.listaFallos;
        
        } else {
          console.error('Error al obtener datos del API');
        }
      },
      (error) => {
        console.error('Error de conexión al API');
      }
    );
  }


  cargarDatosBT01() {
    this.creacionOrdenesService.listarBT01().subscribe(
      (response) => {
        if (response.ResultCode === 0 && response.data) {
          this.bt01Data = response.data;
          console.log(response.data)
        } else {
          console.error('Error al obtener datos BT01 del API');
        }
      },
      (error) => {
        console.error('Error de conexión al API');
      }
    );
  }

  cargarDatosMC01() {
    this.creacionOrdenesService.listarMC01().subscribe(
      (response) => {
        if (response.ResultCode === 0 && response.data) {
          this.mc01Data = response.data;
          console.log(response.data);
          // Puedes asignar los datos a otras propiedades o realizar otras acciones aquí
        } else {
          console.error('Error al obtener datos MC01 del API');
        }
      },
      (error) => {
        console.error('Error de conexión al API');
      }
    );
  }

  

  cargarDatosAdicionalesMC01(tipo:any, codigo:any){
  this.creacionOrdenesService.datosMC01(codigo,tipo).subscribe(
    (response)=> {
      if(response.ResultCode === 0 && response.data){
        
        this.dAdicionales = response.data[0];
        this.miFormulario.get('cliente')?.setValue(this.dAdicionales.CardCode);
        this.miFormulario.get('nombre')?.setValue(this.dAdicionales.CardName);
        this.miFormulario.get('direccion')?.setValue(this.dAdicionales.Street);
        this.miFormulario.get('ciudad')?.setValue(this.dAdicionales.City);
        this.miFormulario.get('telefono')?.setValue(this.dAdicionales.Phone1);
        console.log('Datos dicionales de MC01',this.dAdicionales);
      }else{
        console.error('Error al obtener datos MC01 del API');
      }
    },
    (error) => {
      console.error('Error de conexión al API');
    }
  );
}




cargarDatosSeriealmacen(serie: any) {
  this.creacionOrdenesService.seriesAlmacen(serie).subscribe(
    (response) => {
      if (response.ResultCode === 0 && response.data) {
        this.SerieAlmacen = response.data;
        console.log('Datos de almacen por serie', this.SerieAlmacen );
        console.log('Comparar', this.SerieAlmacen[0].WhsName)
        this.almacenSeleccionado = response.data.map((almacen: { WhsName: any; WhsCode: any; }) => ({ label: almacen.WhsName, value: almacen.WhsCode }));
        console.log('Datos de almacen Seleccionado', this.almacenSeleccionado);
        
      } else {
        console.error('Error al obtener datos MC01 del API');
      }
    },
    (error) => {
      console.error('Error de conexión al API');
    }
  );
}


  

  cargarDatosCotizaciones1(codigo: any) {
    // Obtén el CardName del input dAdicionales
    const cardNameInput = this.dAdicionales?.CardName || '';
    console.log('Este es el dato del input', cardNameInput);
  
    // Verifica si el CardName coincide con el valor del CardName en las cotizaciones
    this.creacionOrdenesService.traerCotizaciones(codigo).subscribe(
      (response) => {
        if (response.ResultCode === 0 && response.data) {
          this.dCotizaciones = response.data;
  
          // Verifica si hay alguna cotización que coincide con el CardName
          const cotizacionCoincide = this.dCotizaciones.some(cotizacion => cotizacion.CardName === cardNameInput);
  
          if (cotizacionCoincide) {
            console.log('Comparacion', cotizacionCoincide);
            console.log('Datos de las cotizaciones', this.dCotizaciones);
            this.cotizaciones = true;

            this.cotizacionSeleccionada = response.data.find((cotizacion:any) => cotizacion.CardName === cardNameInput);



          } else {
            // Si no hay coincidencias, muestra un mensaje de error
            Swal.fire({
              title: 'Error',
              text: 'El CardName no coincide con las cotizaciones.',
              icon: 'error'
            });
            console.error('Error: No hay coincidencias entre CardName y las cotizaciones.');
            // Aquí puedes mostrar un SweetAlert con el mensaje de error
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No existe ningun cotización asociada.',
            icon: 'error'
          });
          console.error('Error al obtener datos de cotizaciones del API');
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Error de conexión al API.',
          icon: 'error'
        });
        console.error('Error de conexión al API');
        // Aquí también puedes mostrar un SweetAlert con el mensaje de error de conexión
      }
    );

    
  }
  
/*
  cargarDatosCotizaciones(codigo: any) {
    // Obtén el CardName del input dAdicionales
    const cardNameInput = this.dAdicionales?.CardName || '';
    console.log('Este es el datos del input', cardNameInput);
  
    // Verifica si el CardName coincide con el valor del CardName en las cotizaciones
    this.creacionOrdenesService.traerCotizaciones(codigo).subscribe(
      (response) => {
        if (response.ResultCode === 0 && response.data) {
          this.dCotizaciones = response.data;
  
          // Verifica si hay alguna cotización que coincide con el CardName
          this.cotizacionSeleccionada = this.dCotizaciones.find(cotizacion => cotizacion.CardName === cardNameInput);
  
          if (this.cotizacionSeleccionada) {
            //console.log('Comparacion', this.cotizacionSeleccionada);
            console.log('Datos de las cotizaciones', this.dCotizaciones);
  
            
  
            // Verifica si la opción ya existe en el arreglo
            const opcion = `${this.cotizacionSeleccionada.SeriesName} - ${this.cotizacionSeleccionada.DocNum}`;
            if (!this.opcionesCotizaciones.includes(opcion)) {
              // Agrega la nueva opción al arreglo
              this.opcionesCotizaciones.push(opcion);
  
              // Asigna el nuevo arreglo de opciones al p-dropdown
              this.miFormulario.get('dropdownCotizaciones')?.setValue(this.opcionesCotizaciones);
  
              // Muestra un mensaje de éxito
              Swal.fire({
                title: 'Éxito',
                text: 'La fila seleccionada coincide con la serie seleccionada.',
                icon: 'success'
              });
            } 
  
            // Muestra el modal de cotizaciones
            this.cotizaciones = true;
          } else {
            // Si no hay coincidencias, muestra un mensaje de error
            Swal.fire({
              title: 'Error',
              text: 'El CardName no coincide con las cotizaciones.',
              icon: 'error'
            });
            console.error('Error: No hay coincidencias entre CardName y las cotizaciones.');
            // Aquí puedes mostrar un SweetAlert con el mensaje de error
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No existe ninguna cotización asociada.',
            icon: 'error'
          });
          console.error('Error al obtener datos de cotizaciones del API');
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Error de conexión al API.',
          icon: 'error'
        });
        console.error('Error de conexión al API');
        // Aquí también puedes mostrar un SweetAlert con el mensaje de error de conexión
      }
    );
  }*/


/*
cargarDatosDetallesCotizaciones(docentry:any){
this.creacionOrdenesService.traerDescripcionCotizaciones(docentry).subscribe(
  (response)=>{
    if(response.ResultCode === 0 && response.data){
      this.dDetallesCotizaciones = response.data;
      console.log('Datos detalles de cotizaciones', this.dDetallesCotizaciones)
    }else {
      console.error('Error al obtener datos de cotizaciones del API');
    }
  },
  (error) => {
    console.error('Error de conexión al API');
  
  }
)
}*/


cargarDatosDetallesCotizaciones(docentry: any): Observable<any[]> {
  return this.creacionOrdenesService.traerDescripcionCotizaciones(docentry).pipe(
    map(response => {
      if (response.ResultCode === 0 && response.data) {
      this.dDetallesCotizaciones= response.data
      console.log('Datos detalles de cotizaciones', this.dDetallesCotizaciones);
     
      return response.data;
    
       
      } else {
        console.error('Error al obtener datos de cotizaciones del API');
        return [];
      }
    }),
    catchError(error => {
      console.error('Error de conexión al API', error);
      return [];
    })
  );
}


cargarDatosRefacciones(){
  
  this.creacionOrdenesService.datosRefacciones().subscribe(
    (response)=>{
      if(response.ResultCode=== 0 && response.data){
     
        this.dRefacciones = response.data
        console.log('Despues de la suscripcion',this.dRefacciones);
        const whsNames = this.dRefacciones.map((item) => item.WhsName);
        console.log('Valores de WhsName:', whsNames);
      }else{
        console.error('Error al obtener datos del API')
      }
    }
  )
}




cargarDatosManoDeObra(){
  this.creacionOrdenesService.traerManoDeObra().subscribe(
    (response)=>{
      if(response.ResultCode ===0 && response.data){
        this.dManoDeObra = response.data
        console.log('Datos Mano de Obra',this.dManoDeObra);
      }else {
        console.error('Error al obtener datos del API')
      }
    }
  )
}


cargarDatosProveedoresTerceros(){
  this.creacionOrdenesService.traerProveedoresTerceros().subscribe(
    (response)=>{
      if(response.ResultCode === 0 && response.data){
        this.dProveedores = response.data
        console.log('Estos son los proveedores', this.dProveedores);
      }else{
        console.error('Error al obtener datos del API')
      }
    }
  )
}

/*
cargarDatosOrdenTerceros(){
  this.creacionOrdenesService.traerOedenCompraTerceros1().subscribe(
    (response)=>{
     if(response.ResultCode ===0 && response.data){
      this.dOrdenCompra = response.data
      console.log('Estosjsj', this.dOrdenCompra)
     }else {
      console.error('Error al obtener datos MC01 del API');
    }
  },
  (error) => {
    console.error('Error de conexión al API');
    }
  )
}*/


cargarDatosRecomendaciones(){
  this.creacionOrdenesService.traerRecomendaciones().subscribe(
    (response)=>{
      if(response.ResultCode ===0 && response.data){
        this.dRecomendaciones = response.data
        console.log('Datos Recomendaciones',this.dRecomendaciones);
      }else {
        console.error('Error al obtener datos del API')
      }
    }
  )
}

/*
cargarDatosOrdenTerceros1(codigo:any):Observable<any[]>{
  return this.creacionOrdenesService.traerOedenCompraTerceros(codigo).pipe(
    map(response => {
      if (response.ResultCode === 0 && response.data) {
      this.dOrdenCompra= response.data
      console.log('Datos detalles de cotizaciones', this.dOrdenCompra);
     
      return response.data;
    
       
      } else {
        console.error('Error al obtener datos  del API');
        return [];
      }
    }),
    catchError(error => {
      console.error('Error de conexión al API', error);
      return [];
    })
  );
}*/


/*
cargarDatosOrdenTerceros21(proveedor: any) {
  this.creacionOrdenesService.traerOedenCompraTerceros(proveedor.codigo).subscribe(
    (response) => {
      if (response.ResultCode === 0 && response.data) {
        this.dOrdenCompra = response.data;
        console.log('Ordenes de compra asociadas:', this.dOrdenCompra);
      } else {
        console.error('Error al obtener datos del API para el proveedor: ', proveedor.CardCode);
      }
    },
    (error) => {
      console.error('Error de conexión al API');
    }
  );
}*/


onFilterChange() {
  // Puedes agregar lógica adicional aquí si es necesario
  // Filtra la tabla cuando el valor de filtroGlobal cambia
  //dt3.filterGlobal(this.filtroGlobal, 'contains');
}




  onDropdownChange1(event: any) {
  
    console.log('Dropdown changed:', event.value);
    const serieSeleccionada = this.miFormulario.value.selectedSeries;
    console.log('Esta es la serie eleccionada', serieSeleccionada);
    let selectedObject = event.value;
    console.log(event.value);
    // Verifica si es una cadena (como 'CULIACAN')
    if (typeof event.value === 'string') {
      // Puedes buscar el objeto correspondiente en tu lista de series
      selectedObject = this.listaSeries.find(series => series.Code === event.value);
      console.log('Opcion', selectedObject);
    }
  
    if (selectedObject) {
      const nextNum = selectedObject.U_NextNum;
  
      console.log('U_NextNum:', nextNum);
  
      if (nextNum !== undefined) {
        // Asigna el valor de U_NextNum al FormControl correspondiente
        this.miFormulario.get('selectedSeriesInput')?.setValue(nextNum);
      }
  
      // Actualiza el valor de almacenSeleccionado
      this.cargarDatosSeriealmacen(selectedObject.Code);
      this.almacenSeleccionado = selectedObject.Code; // Asegúrate de que la propiedad almacen exista en tu objeto
      this.checked= true
      
      console.log('Datos de almacen Seleccionado antes', this.almacenSeleccionado);

    }
  }
  
 
  
/*
  onTipoChange(event: any) {
    console.log('Tipo changed:', event.value);
  
    // Verifica si se ha seleccionado previamente un tipo de trabajo
    if (this.miFormulario.get('tipoTrabajo')?.value ) {
      if(this.miFormulario.get('selectedSeries')?.value){
// Establece las variables en función de la opción seleccionada
this.isBT01Selected = event.value === 'BT01';
this.isMC01Selected = event.value === 'MC01';

// Evalúa la opción seleccionada en el segundo p-dropdown
if (this.isBT01Selected) {
  this.visibleBT01Modal = true;
} else if (this.isMC01Selected) {
  this.visibleMC01Modal = true;
} else {
  // Muestra una alerta o realiza alguna acción si la opción no coincide
  console.error('Error: La opción seleccionada en el segundo p-dropdown no coincide.');
  // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción.
}
   }else{
        Swal.fire({
          title: 'Error',
          text: 'Debes seleccionar una serie antes de seleccionar el tipo.',
          icon: 'error'
        });
      }
      
    } else {
      // Muestra una alerta o realiza alguna acción si no se ha seleccionado un tipo de trabajo
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un tipo de trabajo antes de seleccionar el tipo.',
        icon: 'error'
      });
      console.error('Error: Debes seleccionar un tipo de trabajo antes de seleccionar el tipo.');
      // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción.
    }
  }*/

/*
  onTipoChange(event: any) {
    console.log('Tipo changed:', event.value);
    
    // Verifica si se ha seleccionado previamente un tipo de trabajo
    if (this.miFormulario.get('tipoTrabajo')?.value) {

      const tipoSeleccionado = this.listaTrabajos.find(tipo => tipo.Code === event.value);
      
      // Asigna el nombre del tipo de equipo seleccionado en el formulario reactivo
      if (tipoSeleccionado) {
        this.miFormulario.get('U_TipEqu')?.setValue(tipoSeleccionado);
  
        // Resto de tu código...
        // Establece las variables en función de la opción seleccionada
        this.isBT01Selected = event.value === 'BT01';
        this.isMC01Selected = event.value === 'MC01';
  
        // Evalúa la opción seleccionada en el segundo p-dropdown
        if (this.isBT01Selected) {
          this.visibleBT01Modal = true;
        } else if (this.isMC01Selected) {
          this.visibleMC01Modal = true;
        } else {
          // Muestra una alerta o realiza alguna acción si la opción no coincide
          console.error('Error: La opción seleccionada en el segundo p-dropdown no coincide.');
          // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción.
        }
      } else {
        // Manejar el caso cuando no se encuentra el tipo seleccionado
        Swal.fire({
          title: 'Error',
          text: 'No se pudo encontrar el tipo de equipo seleccionado.',
          icon: 'error'
        });
        // Puedes mostrar un mensaje de error o realizar otra acción según tu lógica
      }
    } else {
      // Muestra una alerta o realiza alguna acción si no se ha seleccionado un tipo de trabajo
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un tipo de trabajo antes de seleccionar el tipo.',
        icon: 'error'
      });
      console.error('Error: Debes seleccionar un tipo de trabajo antes de seleccionar el tipo.');
      // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción.
    }
  }*/
  
  onTipoChange(event: any) {
    console.log('Tipo changed:', event.value);
  
    if (this.miFormulario.get('tipoTrabajo')?.value) {
      const tipoSeleccionado = this.listaTrabajos.find(tipo => tipo.Code === event.value);
  
      if (tipoSeleccionado) {
        this.miFormulario.get('U_TipEqu')?.setValue(tipoSeleccionado);
        this.isBT01Selected = event.value === 'BT01';
        this.isMC01Selected = event.value === 'MC01';
  
        if (this.isBT01Selected) {
          this.visibleBT01Modal = true;
        } else if (this.isMC01Selected) {
          this.visibleMC01Modal = true;
        } else {
          console.error('Error: La opción seleccionada en el segundo p-dropdown no coincide.');
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo encontrar el tipo de equipo seleccionado.',
          icon: 'error'
        });
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un tipo de trabajo antes de seleccionar el tipo.',
        icon: 'error'
      });
      console.error('Error: Debes seleccionar un tipo de trabajo antes de seleccionar el tipo.');
    }
  }
  
  
  onRowDoubleClick(event: any, rowData: any, tipo: string, codigo:any) {
    this.cargarDatosAdicionalesMC01(tipo, codigo)
    console.log(tipo,codigo)
  let seleccion= this.miFormulario.value.tipoTrabajo
   if(this.elementosTabla.length>0 && this.elementosTabla[0].tipo !== null ){
      if(seleccion=== 'MP1200' || seleccion==='MP1000'|| seleccion==='MP200'|| seleccion==='MP2000'|| 
      seleccion==='MP2400'|| seleccion==='MP250'|| seleccion==='MP500'|| seleccion==='MP600'){
        this.elementosTabla[this.elementosTabla.length-1]={tipo:1, U_NReparto: rowData.U_NReparto, U_NumEcon:rowData.U_NumEcon,
           U_GoodsBrand:rowData.U_GoodsBrand,
          U_GoodsModel:rowData.U_GoodsModel, U_GoodsSerial:rowData.U_GoodsSerial, U_OdoAct:rowData.U_OdoAct, U_OdomNue:rowData.U_OdomNue}
          this.visibleBT01Modal= false;
         this.visibleMC01Modal=false;
         
        this.elementosTabla.push({tipo:null, U_NReparto:'', U_NumEcon:'', U_GoodsBrand:'', U_GoodsModel:'',U_GoodsSerial:'', U_OdoAct:'', U_OdomNue:''})
     
        this.selectedRowData = rowData;
        
        this.clienteProp = rowData.U_CliProp;
        this.nombreProp = rowData.U_NCliProp;
        //this.direccionProp = rowData.dAdicionales.Street;
        console.log(this.direccionProp)
        this.ciudad = rowData.City
        
        
        this.selectedU_NReparto = rowData.U_NReparto;
       
      }else{
        Swal.fire({
          title: "Error",
          text: "No se puede agregar mas equipos",
          icon: "error"
        });
this.visibleBT01Modal=false;
this.visibleMC01Modal=false
      }
   }
   else if(this.elementosTabla.length===1 && this.elementosTabla[0].tipo === null ){
    this.elementosTabla[0]={tipo:1, U_NReparto: rowData.U_NReparto, U_NumEcon:rowData.U_NumEcon, U_GoodsBrand:rowData.U_GoodsBrand,
       U_GoodsModel:rowData.U_GoodsModel, U_GoodsSerial:rowData.U_GoodsSerial, U_OdoAct:rowData.U_OdoAct, U_OdomNue:rowData.U_OdomNue}
       this.visibleBT01Modal= false;
       this.visibleMC01Modal=false;

       this.elementosTabla.push({tipo:null, U_NReparto:'', U_NumEcon:'', U_GoodsBrand:'', U_GoodsModel:'',U_GoodsSerial:'', U_OdoAct:'', U_OdomNue:''})

      

       this.selectedRowData = rowData;

       this.clienteProp = rowData.U_CliProp;
      
       this.nombreProp = rowData.U_NCliProp;
       //this.direccionProp = rowData.dAdicionales.Street;
      
       this.selectedU_NReparto = rowData.U_NReparto;
   }
  }



onrowDobleClickref(orden: any) {
  // Verifica si la opción "Cotización" está seleccionada en el dropdown de estados
  if (this.miFormulario.get('estadoSeleccionado')?.value === 'C') {
    // Resto de tu lógica...
    console.log('Datos de la fila seleccionada:', orden);

    // Verifica si SerieAlmacen tiene al menos un elemento
    if (this.SerieAlmacen.length > 0) {
      if (this.selectedU_NReparto) {
        // Verifica si la serie de la fila seleccionada coincide con alguna entrada en SerieAlmacen
        const coincideConAlgunAlmacen = this.SerieAlmacen.some(almacen => 
          orden.WhsName === almacen.WhsName || orden.WhsCode === almacen.WhsCode
        );

        if (coincideConAlgunAlmacen) {
          // Crea una nueva fila con los datos de la orden seleccionada
          const nuevaFila = {
            NoParte: '',
            Descripcion: orden.ItemName,
            Cantidad: '',
            CC: '',
            SC: '',
            U_GoodsSerial: '',
            Almacen: orden.WhsName,
            Existencia: '',
            original: true,
          };

          // Agrega la nueva fila a elementosTablaRefacciones
          this.elementosTablaRefacciones.push(nuevaFila);

          // Muestra un mensaje de éxito
          Swal.fire({
            title: 'Éxito',
            text: 'La fila seleccionada coincide con uno de los almacenes por serie seleccionado.',
            icon: 'success'
          });
        } else {
          // Muestra un mensaje de error si la serie no coincide con ningún almacen
          Swal.fire({
            title: 'Error',
            text: 'La fila seleccionada no coincide con ninguno de los almacenes por serie seleccionado.',
            icon: 'error'
          });
        }
      } else {
        // Muestra un mensaje de error si el select de Reparto está vacío
        Swal.fire({
          title: 'Error',
          text: 'El select de Reparto está vacío.',
          icon: 'error'
        });
        console.error('Error: N.Reparto está vacío');
      }
    } else {
      // Muestra un mensaje de error si SerieAlmacen está vacío
      Swal.fire({
        title: 'Error',
        text: 'El select de Serie Almacen está vacío.',
        icon: 'error'
      });
      console.error('Error: SerieAlmacen está vacío');
    }
  } else {
    // Si la opción "Cotización" no está seleccionada, muestra un mensaje de error
    Swal.fire({
      title: 'Error',
      text: 'La opción "Cotización" no está seleccionada.',
      icon: 'error'
    });
    console.error('Error: La opción "Cotización" no está seleccionada en el select de estados.');
  }

  this.refacciones = false;
}


/*
onrowDobleClickref(orden: any) {
  // Verifica si la opción "Cotización" está seleccionada en el dropdown de estados
  if (this.miFormulario.get('estadoSeleccionado')?.value === 'C') {
    // Resto de tu lógica...
    console.log('Datos de la fila seleccionada:', orden);

    // Verifica si SerieAlmacen tiene al menos un elemento
    if (this.SerieAlmacen.length > 0) {
      // Verifica si la serie de la fila seleccionada coincide con la serie seleccionada en SerieAlmacen
      if (this.selectedU_NReparto && (orden.WhsName === this.selectedU_NReparto || orden.WhsCode === this.selectedU_NReparto)) {
        // Crea una nueva fila con los datos de la orden seleccionada
        const nuevaFila = {
          NoParte: '',
          Descripcion: orden.ItemName,
          Cantidad: '',
          CC: '',
          SC: '',
          U_GoodsSerial: '',
          Almacen: orden.WhsName,
          Existencia: '',
          original: true,
        };

        // Agrega la nueva fila a elementosTablaRefacciones
        this.elementosTablaRefacciones.push(nuevaFila);

        // Muestra un mensaje de éxito
        Swal.fire({
          title: 'Éxito',
          text: 'La fila seleccionada coincide con la serie por reparto seleccionada.',
          icon: 'success'
        });
      } else {
        // Muestra un mensaje de error si la serie no coincide con la seleccionada
        Swal.fire({
          title: 'Error',
          text: 'La fila seleccionada no coincide con la serie por reparto seleccionada.',
          icon: 'error'
        });
      }
    } else {
      // Muestra un mensaje de error si SerieAlmacen está vacío
      Swal.fire({
        title: 'Error',
        text: 'El select de Serie Almacen está vacío.',
        icon: 'error'
      });
      console.error('Error: SerieAlmacen está vacío');
    }
  } else {
    // Si la opción "Cotización" no está seleccionada, muestra un mensaje de error
    Swal.fire({
      title: 'Error',
      text: 'La opción "Cotización" no está seleccionada.',
      icon: 'error'
    });
    console.error('Error: La opción "Cotización" no está seleccionada en el select de estados.');
  }

  this.refacciones = false;
}*/


onAlmacenSeleccionadoChange(event: any) {
  console.log('Opción seleccionada:', event.value);
  // Puedes hacer más cosas aquí según tus necesidades
}


onrowDobleClickcotizacion1(cotizacion: any) {
  if (this.miFormulario.get('estadoSeleccionado')?.value === 'C') {
    console.log('Datos de la fila seleccionada:', cotizacion);

    // Obtén el valor seleccionado del dropdown
    const serieSeleccionada = this.miFormulario.value.selectedSeries;

    // Verifica si es una cadena (como 'CULIACAN')
    let selectedObject = serieSeleccionada;
    if (typeof serieSeleccionada === 'string') {
      // Busca el objeto correspondiente en la lista de series
      selectedObject = this.listaSeries.find(series => series.Code === serieSeleccionada);
    }

    // Verifica si existe un objeto seleccionado
    if (selectedObject) {
      // Verifica la condición deseada
      if (cotizacion.SeriesName === selectedObject.Code) {
        this.cargarDatosDetallesCotizaciones(cotizacion.DocEntry).subscribe(
          detallesCotizacion => {
            // Verifica si la opción ya existe en el arreglo

            const opcion = `${cotizacion.SeriesName} - ${cotizacion.DocNum}`;
            const existeEnArreglo = this.opcionesCotizaciones.some(op => op === opcion);

            if (!existeEnArreglo) {
              // Agrega la nueva opción al arreglo
              this.opcionesCotizaciones.push(opcion);

              // Asigna el nuevo arreglo de opciones al p-dropdown
              this.miFormulario.get('dropdownCotizaciones')?.setValue(this.opcionesCotizaciones);

              // Verifica si los detalles ya están cargados en la tabla
              const detallesYaCargados = this.elementosTablaRefacciones.some(fila => fila.Almacen === cotizacion.DocEntry);

              if (!detallesYaCargados) {
                // Carga los detalles en la tabla solo si no están cargados
                detallesCotizacion.forEach(detalle => {
                  const nuevaFila = {
                    id_padre: opcion,
                    NoParte: detalle.ItemCode,
                    Descripcion: detalle.Dscription,
                    Cantidad: detalle.Quantity,
                    CC: 'CC',
                    SC: '',
                    U_GoodsSerial: '',
                    Almacen: cotizacion.SeriesName,
                    Existencia: '',
                    original: false,
                    cotizacionAsociada: true,
                  };

                  // Agregar la nueva fila a la tabla
                  this.elementosTablaRefacciones.push(nuevaFila);
                  this.elementosTablaRefacciones = [...this.elementosTablaRefacciones];
                });
              } else {
                // Muestra un mensaje de error si los detalles ya están cargados
                Swal.fire({
                  title: 'Error',
                  text: 'Los detalles de la cotización ya están cargados en la tabla.',
                  icon: 'error'
                });
                console.error('Error: Los detalles de la cotización ya están cargados en la tabla.');
              }
            } else {
              // Muestra un mensaje de error si la opción ya existe
              Swal.fire({
                title: 'Error',
                text: 'La cotización ya está cargada.',
                icon: 'error'
              });
              console.error('Error: La cotización ya está cargada.');
            }
          }
        );
      } else {
        // Muestra un mensaje de error
        Swal.fire({
          title: 'Error',
          text: 'La propiedad SeriesName no coincide con el valor de Code.',
          icon: 'error'
        });
        console.error('Error: La propiedad SeriesName no coincide con el valor de Code.');
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se ha seleccionado ninguna opción en el dropdown',
        icon: 'error'
      });
      console.error('Error: No se ha seleccionado ninguna opción en el dropdown.');
    }
  } else {
    // Si la opción "Cotización" no está seleccionada, muestra un mensaje de error
    Swal.fire({
      title: 'Error',
      text: 'La opción "Cotización" no está seleccionada.',
      icon: 'error'
    });
    console.error('Error: La opción "Cotización" no está seleccionada en el select de estados.');
  }
  this.cotizaciones = false;
}


onrowDobloClickManoDeObra1(mano: any) {
  // Crea un nuevo objeto para la nueva posición en la tabla
  
    const nuevaManoDeObra = {
      Articulo: mano.ItemCode,
      Nombres: mano.ItemName,
      Horas: mano.stocktotal,
      Cantidad: '',
      Tecnico: '',   
      Nombre: '',    
      Fecha: '',   
      HReales: '', 
      Ejecutada: '',
    
    };
  
    this.elementosTablaManoDeObra.push(nuevaManoDeObra);
  
    this.ultimaPosicionCreada = this.elementosTablaManoDeObra.length - 1;
  
    //this.manoDeObra = false
    this.elementosTablaManoDeObra = [...this.elementosTablaManoDeObra];
    // Limpia el formulario si es necesario
    this.miFormulario.reset();
  
  this.manoDeObra = false
}

/*
onrowDobloClickManoDeObra1(mano: any) {
  // Verifica si los campos de los selects no están vacíos
  if (this.miFormulario.get('tipoTrabajo')?.value &&
      this.miFormulario.get('selectedSeries')?.value) {

    // Crea un nuevo objeto para la nueva posición en la tabla
    const nuevaManoDeObra = {
      Articulo: mano.ItemCode,
      Nombres: mano.ItemName,
      Horas: mano.stocktotal,
      Cantidad: '',
      Tecnico: '',   
      Nombre: '',    
      Fecha: '',   
      HReales: '', 
      Ejecutada: '',
    };
  
    this.elementosTablaManoDeObra.push(nuevaManoDeObra);
  
    this.ultimaPosicionCreada = this.elementosTablaManoDeObra.length - 1;
  
    this.elementosTablaManoDeObra = [...this.elementosTablaManoDeObra];
  
    // Limpia el formulario si es necesario
    this.miFormulario.reset();
    

  } else {
    // Muestra un mensaje de error si la validación no se cumple
    Swal.fire({
      title: 'Error',
      text: 'Debe llenar los campos de Tipo de trabajo y Num OT',
      icon: 'error'
    });

    console.error('Error: Alguno de los campos de los selects está vacío.');
  }
  this.manoDeObra = false;
}*/


/*
onrowDobloClickTecnico(manoTecnicos: any) {
  // Busca la posición de nuevaManoDeObra
  const nuevaManoDeObraIndex = this.elementosTablaManoDeObra.findIndex((item) => item.Articulo);

  if (nuevaManoDeObraIndex !== -1) {
    // Actualiza las propiedades "Técnico" y "Nombre" en la misma posición de nuevaManoDeObra
   this.elementosTablaManoDeObra[nuevaManoDeObraIndex].Tecnico = manoTecnicos.Code;
   this.elementosTablaManoDeObra[nuevaManoDeObraIndex].Nombre = manoTecnicos.Name;
    
  } else {
    // Si nuevaManoDeObra no está creada, muestra un mensaje o realiza alguna acción necesaria
    Swal.fire({
      title: 'Error',
      text: 'La posicion nuevaManoDeObra no está creada.',
      icon: 'error'
    });
    console.error("Error: nuevaManoDeObra no está creada");

  }
  this.manoDeObraTecnicos = false;
}*/

onrowDobloClickTecnico(manoTecnicos: any) {
  // Verifica si hay una posición creada
  if (this.ultimaPosicionCreada !== -1) {
    // Actualiza las propiedades "Técnico" y "Nombre" en la última posición de nuevaManoDeObra
    this.elementosTablaManoDeObra[this.ultimaPosicionCreada].Tecnico = manoTecnicos.Code;
    this.elementosTablaManoDeObra[this.ultimaPosicionCreada].Nombre = manoTecnicos.Name;
  } else {  
    // Si nuevaManoDeObra no está creada, muestra un mensaje o realiza alguna acción necesaria
    Swal.fire({
      title: 'Error',
      text: 'Nose ha seleccionado ningun estado para mano de obra.',
      icon: 'error'
    });
    console.error("Error: nuevaManoDeObra no está creada");
  }

  this.manoDeObraTecnicos = false;
}

/*
onrowDobloClickProveedoresTerceros(proveedor: any) {
  // Crea un nuevo objeto para la nueva posición en la tabla
  console.log('Datos de la fila seleccionada:', proveedor);

  const nuevaProveedores = {
    Proveedor: proveedor.CardCode,
    Nombre: proveedor.CardName,
    OrdenCompra: '',
    Total:''
    
  };

  this.elementosTablaTerceros.push(nuevaProveedores);
  this.terceros = false
  this.elementosTablaTerceros = [...this.elementosTablaTerceros];
  // Limpia el formulario si es necesario
  this.miFormulario.reset();
}*/


/*
onrowDobloClickProveedoresTerceros(proveedor: any) {
  // Llamada al servicio para obtener las órdenes de compra asociadas
  this.creacionOrdenesService.traerOedenCompraTerceros(proveedor.CardCode).subscribe(
    (ordenesCompra) => {
      // Asigna las órdenes de compra a la variable correspondiente
      this.ordenesCompraAsociadas = ordenesCompra;

      // Puedes imprimir las órdenes de compra para verificar en consola
      console.log('Órdenes de compra asociadas:', this.ordenesCompraAsociadas);
      console.log(proveedor.CardCode)
    },
    (error) => {
      console.error('Error al cargar órdenes de compra:', error);
    }
  );

  // Resto del código para agregar la fila a la tabla
  const nuevaProveedores = {
    Proveedor: proveedor.CardCode,
    Nombre: proveedor.CardName,
    OrdenCompra: '',
    Total: ''
  };

  this.elementosTablaTerceros.push(nuevaProveedores);
  this.terceros = false;
  this.elementosTablaTerceros = [...this.elementosTablaTerceros];
  // Limpia el formulario si es necesario
  this.miFormulario.reset();
}*/

// tu-componente.component.ts
/*
onrowDobloClickProveedoresTerceros(proveedor: any) {
  // Imprime el CardCode en la consola para verificar que es correcto
  console.log('CardCode del proveedor:', proveedor.CardCode);

  // Llamada al servicio para obtener las órdenes de compra asociadas
  this.creacionOrdenesService.traerOedenCompraTerceros2(proveedor.CardCode).subscribe(
    (ordenesCompra) => {
      // Asigna las órdenes de compra a la variable correspondiente
      this.ordenesCompraAsociadas = ordenesCompra;

      
      // Puedes imprimir las órdenes de compra para verificar en consola
      console.log('Órdenes de compra asociadas:', this.ordenesCompraAsociadas);
     

    },
    (error) => {
      console.error('Error al cargar órdenes de compra:', error);
    }
  );

  // Resto del código para agregar la fila a la tabla
  const nuevaProveedores = {
    Proveedor: proveedor.CardCode,
    Nombre: proveedor.CardName,
    OrdenCompra: '',
    Total: ''
  };

  this.elementosTablaTerceros.push(nuevaProveedores);
  this.terceros = false;
  this.elementosTablaTerceros = [...this.elementosTablaTerceros];
  // Limpia el formulario si es necesario
  this.miFormulario.reset();
}*/


onrowDobloClickProveedoresTerceros(proveedor: any) {
  // Imprime el CardCode en la consola para verificar que es correcto
  
    console.log('CardCode del proveedor:', proveedor.CardCode);

    // Llamada al servicio para obtener las órdenes de compra asociadas
    this.creacionOrdenesService.traerOedenCompraTerceros2(proveedor.CardCode).subscribe(
      (response: any) => {
        // Verifica que la respuesta tenga el código de resultado y data antes de procesarla
        if (response && response.ResultCode === 0 && response.data) {
          // Convierte el objeto 'data' en un array si no es un array ya
          this.ordenesCompraAsociadas = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          // Si no hay datos o el código de resultado no es 0, asigna un array vacío
          this.ordenesCompraAsociadas = [];
          console.error('Error al cargar órdenes de compra:', response.Resultmensaje);
        }
  
        console.log('Órdenes de compra asociadas:', this.ordenesCompraAsociadas);
      },
      (error) => {
        console.error('Error al cargar órdenes de compra:', error);
      }
    );
  
    // Resto del código para agregar la fila a la tabla
    const nuevaProveedores = {
      Proveedor: proveedor.CardCode,
      Nombre: proveedor.CardName,
      OrdenCompra: '',
      Total: ''
    };
  
    this.elementosTablaTerceros.push(nuevaProveedores);
    this.ultimaPosicionCreada = this.elementosTablaTerceros.length - 1;
    
    this.elementosTablaTerceros = [...this.elementosTablaTerceros];
    // Limpia el formulario si es necesario
    this.miFormulario.reset();
  
  this.terceros = false;
}


onrowDobloClickOrdenCompraProveedor(ordenCompra: any) {
  // Verifica si hay una posición creada
  if (this.ultimaPosicionCreada !== -1) {
    this.elementosTablaTerceros[this.ultimaPosicionCreada].OrdenCompra = ordenCompra.CardName;
    this.elementosTablaTerceros[this.ultimaPosicionCreada].Total = ordenCompra.DocTotal;
  } else { 
    // Si nuevaManoDeObra no está creada, muestra un mensaje o realiza alguna acción necesaria
    Swal.fire({
      title: 'Error',
      text: 'La posición nuevaManoDeObra no está creada.',
      icon: 'error'
    });
    console.error("Error: nuevaManoDeObra no está creada");
  }

  this.ordenCompra = false;
}



onrowDobloClickREcomendaciones(recomendacion: any) {
  // Crea un nuevo objeto para la nueva posición en la tabla
  if (this.miFormulario.get('estadoSeleccionado')?.value === 'C'){
    const nuevaRecomendacion = {
      NoParte: recomendacion.ItemCode,
      Descripcion: recomendacion.ItemName,
      Cantidad: '',
      
    };
  
    this.elementosTablaRecomendaciones.push(nuevaRecomendacion);
   
    this.elementosTablaRecomendaciones = [...this.elementosTablaRecomendaciones];
    // Limpia el formulario si es necesario
    this.miFormulario.reset();
  }else{
    Swal.fire({
      title: 'Error',
      text: 'La opción "Cotización" no está seleccionada.',
      icon: 'error'
    });
    console.error('Error: La opción "Cotización" no está seleccionada en el select de estados.');
  }
  this.recomendaciones = false
}


loadDataToInitialTable() {
  // Lógica para cargar datos BT01 y asignarlos a bt01DataArray
  this.bt01DataArray.forEach(row => {
    this.bt01Data.push(row);
  });

  // Lógica para cargar datos MC01 y asignarlos a mc01DataArray
  this.mc01DataArray.forEach(row => {
    this.mc01Data.push(row);
  });

  // Actualizar la tabla principal
  this.dt?.reset();  // Para BT01
  this.mc01Table?.reset();  // Para MC01
}


onEliminarFila(elemento: any) {
  const indice = this.elementosTabla.indexOf(elemento);
  if (indice !== -1) {
    this.elementosTabla.splice(indice, 1);
  }
}

onEliminarFilaterceros(elemento: any) {
  
  if (elemento) {
    const indice = this.elementosTablaTerceros.indexOf(elemento);
    
    if (indice !== -1) {
      this.elementosTablaTerceros.splice(indice, 1);
    }
  } else {
    // Muestra un mensaje de error ya que la fila está asociada a una cotización
    Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar.',
      icon: 'error'
    });
  }
}

onEliminarFilaRecomendacion(elemento: any) {
  
  if (elemento) {
    const indice = this.elementosTablaRecomendaciones.indexOf(elemento);
    
    if (indice !== -1) {
      this.elementosTablaRecomendaciones.splice(indice, 1);
    }
  } else {
    // Muestra un mensaje de error ya que la fila está asociada a una cotización
    Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar.',
      icon: 'error'
    });
  }
}

onEliminarFilaMano(elemento: any) {
  
  if (elemento) {
    const indice = this.elementosTablaManoDeObra.indexOf(elemento);
    
    if (indice !== -1) {
      this.elementosTablaManoDeObra.splice(indice, 1);
    }
  } else {
    // Muestra un mensaje de error ya que la fila está asociada a una cotización
    Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar.',
      icon: 'error'
    });
  }
}

onEliminarFilaRef(elemento: any) {
  // Verifica si la fila a eliminar es una fila original
  if (elemento.original) {
    const indice = this.elementosTablaRefacciones.indexOf(elemento);
    
    if (indice !== -1) {
      this.elementosTablaRefacciones.splice(indice, 1);
    }
  } else {
    // Muestra un mensaje de error ya que la fila está asociada a una cotización
    Swal.fire({
      title: 'Error',
      text: 'Esta fila está asociada a una cotización y no se puede eliminar.',
      icon: 'error'
    });
  }
}




onDropdownChange2(event: any) {
  console.log('Opción seleccionada:', event.value);

  const opcionSeleccionada = this.miFormulario.value.dropdownCotizaciones;

  if (typeof opcionSeleccionada === 'string') {
    const [seriesName, docNum] = opcionSeleccionada.split(' - ');

    const cotizacionSeleccionada = this.dCotizaciones.find((cotizacion: any) =>
      cotizacion.SeriesName === seriesName && cotizacion.DocNum === parseInt(docNum)
    );

    const cotizacionSelect = cotizacionSeleccionada.DocEntry
    console.log('CTS', cotizacionSelect )

    if (cotizacionSeleccionada) {
      this.cotizacionSeleccionadaDocEntry = cotizacionSeleccionada.DocEntry;
      console.log('cotizacion seleccionada docentry', this.cotizacionSeleccionadaDocEntry)
      this.cargarDatosDetallesCotizaciones(cotizacionSeleccionada.DocEntry).subscribe(
        detallesCotizacion => {
          console.log('Detalles de la cotización seleccionada (desde la tabla):', detallesCotizacion);
          
          // Puedes realizar otras acciones con los detalles cargados
        }
      );
    } else {
      console.error('Error: No se encontró la cotización correspondiente en tus datos.');
    }
  }
}

// Método eliminarCotizacionYDetalles
eliminarCotizacionYDetalles2(cotizacion: any) {
  const opcionSeleccionada = this.miFormulario.get('dropdownCotizaciones')?.value;
  console.log('quitar cotizacion')
  console.log(opcionSeleccionada)
  console.log(this.elementosTablaRefacciones)
  if(opcionSeleccionada){
    this.elementosTablaRefacciones = this.elementosTablaRefacciones.filter(opcion => opcion.id_padre !== opcionSeleccionada);
    this.opcionesCotizaciones = this.opcionesCotizaciones.filter(opcion => opcion !== opcionSeleccionada);
    this.miFormulario.get('dropdownCotizaciones')?.setValue(this.opcionesCotizaciones);
  
    console.log('Opción eliminada:', opcionSeleccionada);
    console.log('Nuevas opciones:', this.elementosTablaRefacciones);
  
    const cotizacionSelect = this.cotizacionSeleccionada.DocEntry
    console.log('Valor de la propiedad en el select', cotizacionSelect)

    

  }else{
    Swal.fire({
      title: 'Error',
      text: 'No se ha seleccionado ninguna opción en el dropdown',
      icon: 'error'
    });
    console.error('No hay opción seleccionada en el dropdown.'); 
  }



}




openNew3() {
 
  this.refacciones = true
 }

 cotizacion(){
  this.cotizaciones = true;
 }

 openNewMano(){
  this.manoDeObra = true
 }

 openTerceros(){
  this.terceros = true
 }

 openOrdenCompra(){
  this.ordenCompra = true
 }

recomendacionesModal(){
  this.recomendaciones = true
}

openManoTecnico(){
  this.manoDeObraTecnicos = true
}

  hideBT01Modal() {
    this.visibleBT01Modal = false;
  }
  
  hideMC01Modal() {
    this.visibleMC01Modal = false;
  }

  
  onEstadoSeleccionadoChange(event:any) {
    console.log('Opción seleccionada:', event.value);

    const estadoSeleccionado = this.miFormulario.value.estadoSeleccionado;
    console.log('Este es el estado Seleccionado', estadoSeleccionado)
    // Lógica según tus necesidades


    this.actualizarIndiceActivo();
  }

  private actualizarIndiceActivo() {
    let estadoSeleccionado = this.miFormulario.value.estadoSeleccionado;

    this.diagnosticoHabilitado = estadoSeleccionado === 'D';
    this.refaccionesHabilitado = estadoSeleccionado !== 'D';
    this.manoDeObraHabilitado = estadoSeleccionado !== 'D';
    this.tercerosHabilitado = estadoSeleccionado !== 'D';
    this.recomendacionesHbilitado = estadoSeleccionado !== 'D';
    this.anexosHabilitado = estadoSeleccionado !== 'D';

    if (estadoSeleccionado === 'D' && this.panelActivo !== 'diagnosticoPanel') {
      const panelActual = this.tabView.tabs.find((tab:any) => tab.header === this.panelActivo);
      if (panelActual) {
        panelActual.selected = false; // Oculta el panel actual
      }
      this.panelActivo = 'diagnosticoPanel'; // Establece el panel "Diagnóstico" como activo
    }else {
      this.mostrarContenidoPanelActual();
    }
    
  }

  onTabChange(event: any) {
    this.panelActivo = event.index.header;
  }

  mostrarContenidoPanelActual() {
    if (this.tabView && this.tabView.tabs) {
      const panelActual = this.tabView.tabs.find((tab: any) => tab.header === this.panelActivo);
      if (panelActual) {
        panelActual.selected = true;
        panelActual.content.nativeElement.style.display = 'block';
      }
    }
  }
  
  
  onEstadoSeleccionadoChange1(event: any) {
    console.log('Opción seleccionada:', event.value);
  
    const estadoSeleccionado = this.miFormulario.value.estadoSeleccionado;
    console.log('Este es el estado Seleccionado', estadoSeleccionado);
  
    
if(estadoSeleccionado === 'D'){
  this.tabIndex = 0; // Índice del panel "Diagnóstico Real"
  
  this.diagnosticoHabilitado = true;
  this.refaccionesHabilitado = false;
  this.manoDeObraHabilitado = false;
  this.tercerosHabilitado = false;
  this.recomendacionesHbilitado = false;
  this.anexosHabilitado = false;
}else{
  this.tabIndex = 1;
  
  this.diagnosticoHabilitado = true;
    this.refaccionesHabilitado = true;
    this.manoDeObraHabilitado = true;
    this.tercerosHabilitado = true;
    this.recomendacionesHbilitado = true;
    this.anexosHabilitado = true;
}
  }
  
  


  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
    this.terceros = true;
}

openNew1() {
  this.product = {};
  this.submitted = false;
 // this.productDialog = true;
  this.terceros = true;
}

openNew2() {
  this.product = {};
  this.submitted = false;
 this.recomendaciones = true
}



openNew4() {
  this.product = {};
  this.submitted = false;
 this.manoDeObra = true
}

hideDialog() {
  this.productDialog = false;
  this.submitted = false;
  this.terceros = false
  this.manoDeObra = false;
  this.refacciones = false;
  this.recomendaciones = false;
  this.cotizaciones = false;
  this.manoDeObraTecnicos = false
  this.ordenCompra = false
}

mTerceros() {
  //this.productDialog = false;
 // this.submitted = false;
  this.terceros = false
  this.manoDeObra = false
}

onchange(event:any){

  let seleccion= this.miFormulario.value.tipoTrabajo
  console.log(this.miFormulario.value.tipoTrabajo)

  if(this.elementosTabla.length >2 && (seleccion==='BD' || seleccion==='CA' || seleccion==='CP' 
  || seleccion ==='CyP'|| seleccion==='HB'|| seleccion==='Hrria'|| seleccion==='Mbra'|| seleccion ==='MC'||
  seleccion==='Mpd'|| seleccion==='PAP'|| seleccion==='RECP'|| seleccion==='Rp'|| seleccion==='Rta'||
  seleccion==='Tr')){
    Swal.fire({
      title: "Error",
      text: "Esta selección no permite tener mas de un equipo agregado en la tabla",
      icon: "error"
    });
    this.miFormulario.patchValue({
      tipoTrabajo: this.valorActual
    });
  } else {
    // Actualiza el valor actual si la validación se cumple
    this.valorActual = seleccion;
  
  }

  
}

}
