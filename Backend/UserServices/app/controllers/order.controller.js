// async function createOrder(req, res) {
//     const userId = req.userId;
//     const { carritoId, conciertos, merchandising } = req.body;


// }

// module.exports = {
//     createOrder
// }

// model Venta {
//     id     String @id @default (auto()) @map("_id") @db.ObjectId
//     /**
//      * Relacion con Usuario
//      */
//     userId String @db.ObjectId
//     user   User @relation(fields: [userId], references: [id])

//     // conciertoID, stock, merchandisingId

//     carritoId String @db.ObjectId
//     carrito   Carrito @relation(fields: [carritoId], references: [id])

//     conciertos    CarritoConcierto[]
//     merchandising CarritoMerchandising[]

//     /**
//      * Relación con Pagos
//      */
//     pagos Pagos[]

//     total     Float
//     fecha     DateTime @default (now())
//     status    Status @default (ACCEPTED)
//     is_active Boolean @default (true)
//     createdAt DateTime @default (now())
//     updatedAt DateTime @updatedAt

//     @@map("ventas")
// }