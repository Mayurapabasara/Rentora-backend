import Order from '../models/order.js';
export async function createOrder(req, res) {

    //RPL0000001

    // if(req.user == null){
    //     res.status(401).json(
    //         {
    //             message: "Unauthorized User"
    //         }
    //     )
    //     return;
    // }
    try{
        const orderList = await Order.find().sort({ date: -1 }).limit(1);

        let newOrderID = "RPL0000001";

        if(orderList.length != 0 && orderList[0].orderId){

            let lastOrderIDInString = orderList[0].orderId //"RPL0000001"

            let lastOrderNumberInString = lastOrderIDInString.replace("RPL","") //"0000001"
            let lastOrderNumber = parseInt(lastOrderNumberInString) //1

            let newOrderNumber = lastOrderNumber + 1; //2
            let newOrderNumberInString = newOrderNumber.toString().padStart(7, "0") //"0000002"

            newOrderID = "RPL" + newOrderNumberInString;
        }

        const newOrder = new Order({
            orderId : newOrderID,
            items : [],
            customerName : req.body.customerName,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
            total : req.body.total,
            status : "pending"
        })

        const savedOrder =  await newOrder.save()

        res.status(201).json({
            message:"Order saved successfully",
            order : savedOrder
        })



    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error creating order"
        });
    }

}