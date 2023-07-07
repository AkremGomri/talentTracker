import { Box, Table } from '@mui/material'
import React from 'react'

export default function MyTestTabPane() {
  return (
    // <Box className="table-responsive">
    // <Table className="table-borderless align-middle mb-0">
    //         <thead className="table-light">
    //             <tr>
    //                 <th scope="col">Test Name</th>
    //                 <th scope="col">Created By</th>
    //                 {/* <th scope="col">Upload Date</th> */}
    //                 <th scope="col">Start date</th>
    //                 <th scope="col">days left</th>
    //                 <th scope="col">Status</th>
    //                 <th scope="col">Action</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {(myAssignedTests || []).map((item, key) => (
    //                 <tr key={key}>
    //                     <td>
    //                         <Box className="d-flex align-items-center">
    //                             {/* <Box className="avatar-sm">
    //                                 <Box
    //                                     className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}>
    //                                     <i className={item.icon}></i>
    //                                 </Box>
    //                             </Box> */}
    //                             <Box className="ms-3 flex-grow-1">
    //                                 <h6 className="fs-15 mb-0"><Link to="#">{item.name}</Link>
    //                                 </h6>
    //                             </Box>
    //                         </Box>
    //                     </td>
    //                     <td>{item.creator.fullName}</td>
    //                     {/* <td>{item.updatedDate}</td> */}
    //                     <td>{transformDate(item.startDate)}</td>
    //                     { (transformDateToMilliseconds(item.startDate) + transformDaysToMilliseconds(item.duration) - Date.now() > 0)? <td>{transformMillisecondsToDays(transformDateToMilliseconds(item.startDate) + transformDaysToMilliseconds(item.duration) - Date.now())}</td> : <td> - </td>}
    //                     {
    //                         ((new Date(item.startDate).getTime() + item.duration * 24 * 60 * 60 * 1000) > Date.now() && (new Date(item.startDate).getTime() -1  <= Date.now()))
    //                             ? <td style={{ color: (item.AssignedToUsers[0]?.status === 'pending')? "orange" : (item.AssignedToUsers[0]?.status === 'completed')? "green" : 'black' }} >{item.AssignedToUsers[0]?.status}</td>
    //                             : (new Date(item.startDate).getTime() > Date.now()) ? <td style={{ color: 'blue' }}>Too soon</td> 
    //                             : <td style={{ color: 'red' }}>Expired</td>
    //                     }
    //                     <td>
    //                         <UncontrolledDropdown direction='start'>
    //                             <DropdownToggle tag="a" className="btn btn-light btn-icon" id="dropdownMenuLink15" role="button">
    //                                 <i className="ri-equalizer-fill"></i>
    //                             </DropdownToggle>
    //                             <DropdownMenu>
    //                                 <DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted" />View</DropdownItem>
    //                                 <DropdownItem onClick={(e) => handleStartTest(e, item)} ><i className="ri-download-2-fill me-2 align-middle text-muted"/>Start</DropdownItem>
    //                                 <DropdownItem divider />
    //                                 <DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted" />Delete</DropdownItem>
    //                             </DropdownMenu>
    //                         </UncontrolledDropdown>
    //                     </td>
    //                 </tr>
    //             ))}
    //         </tbody>

    //     </Table>
    //     <TakeTestModal open={!!selectedTest} handleCloseModal={() => setSelectedTest(null)} selectedTest={selectedTest} initialSkills={profile?.skills} />
    // </Box>
  )
}
