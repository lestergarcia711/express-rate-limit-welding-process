export const verEstadoMaquina = (req, res)=>{
    res.status(200).json({
        maquina: " TIG-master 3000",
        estado: "Lista y operativa",
        temperatura: "Normal"
    });
};

export const procesarSoldaduraTig = (req, res)=> {
    const pieza = req.body.pieza ?? 'Pieza generica';

    console.log(`[operacion] Soldando con TIG  la pieza:${pieza}`);

    res.status(200).json({
        status:"success",
        mensaje: `Soldaura TIG completada en ${pieza}.`,
    });
};