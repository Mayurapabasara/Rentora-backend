import Order from '../models/order.js';
import Product from "../models/product.js";

function isAdminUser(req) {
    return req.user && req.user.role === "admin";
}

function isCustomerUser(req) {
    return req.user && req.user.role === "user";
}


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
        const user = req.user;
        if (!user) {
            res.status(401).json(
                {
                    message: "User not found"
                });
            return;
        }

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

        let customerName = req.body.customerName;
            if(customerName == null){
                customerName = user.fullname;
            }

        let phone = req.body.phone;
            if(phone == null){
                phone = "Not provided";
            }

        const ItemInRequest = req.body.items;

            if(ItemInRequest == null){
                res.status(401).json({ message: "Item not found" });
                return;
            }

            const itemsToBeAdded = [];
            let total = 0;

            if(!Array.isArray(ItemInRequest)){
                res.status(401).json({ message: "Item not array" });
                return;
            }

            for(let i=0; i<ItemInRequest.length; i++){

                const item = ItemInRequest[i];

                const product = await Product.findOne({productId:item.productId});

                if(product == null){
                    res.status(401).json({
                        code: "not found",
                        message: `Prodct with Id ${item.productId} not found.`,
                        productId:item.productId,
                    });
                    return;
                }

                if(product.stock != null && product.stock < item.quantity){
                    return res.status(401).json({
                        code: "insfficient stock",
                        message: `Insufficient stock for prodct with Id ${item.productId}`,
                        productId: item.productId,
                        availableStock: product.stock
                    })
                }

                itemsToBeAdded.push({
                    productId:item.productId,
                    name: product.name,
                    quantity:item.quantity,
                    price:product.price,
                    image: product.images?.[0] || ""
                });
                total += product.price * item.quantity;
            }


        const newOrder = new Order({
            orderId : newOrderID,
            items : itemsToBeAdded,
            customerName : customerName,
            email : user.email,
            phone : phone,
            address : req.body.address,
            total : total
        })

        const savedOrder =  await newOrder.save()

        //decrease item count
        // for(let i=0; i<ItemsToBeAdded.length; i++){
        //     const item = itemsToBeAdded[i];
        //     await Product.updateOne(
        //         {productId : item.productId},
        //         {$inc: {stock: -item.quantity}}
        //     )
        // }

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

// export async function getOrder(req, res) {
//
//     if(isAdmin(req)){
//         const orders = await Order.find().sort({date:-1})
//         res.json(orders);
//     }else if(isCustomer(req)){
//         const user = req.user;
//         const orders = await Order.find({email:user.email}).sort({date:-1})
//         res.json(orders);
//     }else{
//         res.status(401).json({
//             message: "You are not authorized to view orders."
//         })
//     }
// }

export async function getOrder(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (req.user.role === "admin") {
            const orders = await Order.find().sort({ date: -1 });
            return res.json(orders);
        }

        if (req.user.role === "user") {
            const orders = await Order.find({ email: req.user.email }).sort({ date: -1});
            return res.json(orders);
        }

            return res.status(403).json({
                message: "Forbidden"
            });

        }catch (err) {
            console.error("GET ORDER ERROR:", err);
            res.status(500).json({
                message: "Error fetching orders"
            });
        }
    }

export async function updateOrderStatus(req, res) {

    if (!isAdminUser(req)) {
        return res.status(403).json({
            message: "You are not authorized to update order"
        });
    }

    try {

        const orderID = req.params.orderID;
        const newStatus = req.body.status;

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderID },
            { status: newStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Error updating order"
        });
    }
}