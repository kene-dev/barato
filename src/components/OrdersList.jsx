import { useGetMyOrdersQuery } from '@/app/features/api/orderApiSlice'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { TbListDetails } from "react-icons/tb";

const OrdersList = () => {
  const {data} = useGetMyOrdersQuery();
  console.log(data)



  return (
    <div>
       <Table className='lg:w-full h-full w-[600px]'>
            <TableHeader>
                <TableRow className=''>
                    <TableHead className="text-black">Order Number</TableHead>
                    <TableHead className='text-black'>Date/Time</TableHead>
                    <TableHead className='text-black'>Address</TableHead>
                    <TableHead className='text-black'>Total</TableHead>
                    <TableHead className='text-black'>Status</TableHead>
                    <TableHead className="">View Details</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data && data.map((item) => (
                    <TableRow key={item.id}>
                       <TableCell className='w-[150px] md:w-fit'>
                           {item.id}
                        </TableCell>

                        <TableCell className='w-[150px] md:w-fit'>
                            {new Date(item.created_at).toLocaleString()}
                        </TableCell>

                        <TableCell className='w-[150px] md:w-fit'>
                            {item.shipping ? (
                              <div className='flex flex-wrap items-center gap-2'>
                                 <p>{item.shipping.street}</p> 
                                 <p>{item.shipping.city}</p> 
                                 <p>{item.shipping.state}</p> 
                                 <p>{item.shipping.country}</p> 
                              </div>
                            ): item.temp_address ? (
                              <div className='flex flex-wrap items-center gap-2'>
                                 <p>{item.temp_address.street}</p> 
                                 <p>{item.temp_address.city}</p> 
                                 <p>{item.temp_address.state}</p> 
                                 <p>{item.temp_address.country}</p> 
                              </div>
                            ):null}
                        </TableCell>

                        <TableCell className=' w-[150px] md:w-fit'>
                            ₦{parseFloat(item.total_amount).toFixed(2)}
                        </TableCell>

                        <TableCell className={`text-wrap w-max overflow-x-scroll ${item.status === 'pending' && 'text-yellow-500'} `}>{item.status}</TableCell>

                        <TableCell className='md:w-fit place-items-center'><TbListDetails className='text-primary w-5 h-5' /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default OrdersList