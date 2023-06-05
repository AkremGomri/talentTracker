/* eslint-disable */

import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Pagination, PaginationItem, PaginationLink, Progress, Row, TabContent, Table, TabPane, UncontrolledCollapse, UncontrolledDropdown } from 'reactstrap';
import classnames from 'classnames';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import localforage from 'localforage';
import { FaFolder, FaBell } from 'react-icons/fa';

//Images
import profileBg from '../../assets/images/profile-bg.jpg';
import avatar1 from '../../assets/images/users/avatar-1.jpg';
import avatar2 from '../../assets/images/users/avatar-2.jpg';
import avatar3 from '../../assets/images/users/avatar-3.jpg';
import avatar4 from '../../assets/images/users/avatar-4.jpg';
import avatar5 from '../../assets/images/users/avatar-5.jpg';
import avatar6 from '../../assets/images/users/avatar-6.jpg';
import avatar7 from '../../assets/images/users/avatar-7.jpg';
import avatar8 from '../../assets/images/users/avatar-8.jpg';

import smallImage2 from '../../assets/images/small/img-2.jpg';
import smallImage3 from '../../assets/images/small/img-3.jpg';
import smallImage4 from '../../assets/images/small/img-4.jpg';
import smallImage5 from '../../assets/images/small/img-5.jpg';
import smallImage6 from '../../assets/images/small/img-6.jpg';
import smallImage7 from '../../assets/images/small/img-7.jpg';
import smallImage9 from '../../assets/images/small/img-9.jpg';

import request from '../../services/request';
import { MultipleRadar, SimpleRadar } from '../../components/chart/Radar';
import { BasicColumn, ColumnWithLable } from '../../components/chart/Column';
import TakeTestWindow from '../Test/TakeTestWindow';

import { selectMyProfile } from '../../redux/utils/myProfile';
import { setMyProfile } from '../../redux/features/myProfile';
import TakeTestModal from '../../components/modal/TakeTestModal';

const SimplePage = () => {

    /** new  */
    const [ selectedTest, setSelectedTest ] = useState(null);
    const [showQuizWindow, setShowQuizWindow] = useState(false);
    
    // Function to open the quiz window
    const openQuizWindow = () => {
      setShowQuizWindow(!showQuizWindow);
    };

    const [selectedValues, setSelectedValues] = useState([]);
    const [fields, setFields] = useState([]);

    const myProfile = useSelector(selectMyProfile);
    const dispatch = useDispatch()
    // get the fields from the backend and assign them to selectedValues
    useEffect(() => {
        const getFields = async () => {
            const { data } = await request.get('/api/fields');
            setFields(data);
        }
        getFields();
    }, []);

    const handleFieldChange = (event) => {
      setSelectedValues([event.target.value]);
    };
  
    const handleSubFieldChange = (event) => {
      setSelectedValues((prevValues) => [
        ...prevValues.slice(0, 1),
        event.target.value
      ]);
    };
  
    const handleChildrenItemsChange = (event) => {
      setSelectedValues((prevValues) => [
        ...prevValues.slice(0, 2),
        event.target.value,
        fields.reduce((accumulatedField, currentField) => {
            if(selectedValues.length > 0 && currentField.name !== selectedValues[0] || !currentField.childrenItems.length) return accumulatedField;
            return currentField.childrenItems.reduce((accumulatedSubField, currentSubField) => {
                if( selectedValues.length > 0 && currentSubField.name !== selectedValues[1] || !currentSubField.childrenItems.length) return accumulatedSubField;
                // eslint-disable-next-line prefer-const
                return currentSubField.childrenItems.reduce((accumulatedSkill, currentSkill) => {
                    if(currentSkill.name !== event.target.value || !currentSkill.childrenItems.length) return accumulatedSkill;
                    return currentSkill;
                }, {});
            }, {})
        }, [])
      ]);
    };

    function handleStartTest(event, test){
        setSelectedTest(test);
    }

    //**********************************************//
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState(null);
    const [skillsRadar, setSkillsRadar] = useState(null);
    const [ myAssignedTests, setMyAssignedTests ] = useState(profile?.myAssignedTests);
    const [ toValidateTests, setToValidateTests ] = useState(profile?.myAssignedTests);

    console.log("myAssignedTests: ", myAssignedTests);
    console.log("toValidateTests", toValidateTests);
    
    const [numberOfPendingTests, setNumberOfPendingTests] = useState(myAssignedTests?.reduce((acc, curr) => (curr.AssignedToUsers[0].status === "pending")? acc++ : acc ,0));

    useEffect(() => {
        async function getData(){
            // Retrieve the profile data from LocalForage
            try{
                // const profiles = await localforage.getItem('profile');
                let data;
                // if(!profiles){
                    // eslint-disable-next-line prefer-template
                    data = await request.get('/api/user/profile/' + await localforage.getItem('userId'));
                    
                    // await localforage.setItem('profile', data[0]);
                    
                    dispatch(setMyProfile(data[0]));
                    setProfile(data[0]);
                    setMyAssignedTests(data[0].myAssignedTests);
                    setToValidateTests(data[0].MyEmployeesTests);
                    setSkills({
                        ...skills,
                        labels: data[0].skills.map(skill => skill.name),
                        ListOflevelISets: data[0].skills.map(skill => skill.levelISet), 
                        ListOflevelMyManagerSet: data[0].skills.map(skill => skill.levelMyManagerSet),
                        averageList: data[0].skills.map(skill => (skill.levelISet + skill.levelMyManagerSet) / 2)
                    });
                    setSkills(prev => ({
                        ...prev,
                        ListOflevelISets: prev.ListOflevelISets.filter((value, index) => prev.ListOflevelMyManagerSet[index] || value),
                        ListOflevelMyManagerSet: prev.ListOflevelMyManagerSet.filter((value, index) => prev.ListOflevelISets[index] || value),
                        averageList: prev.averageList.filter((value, index) => prev.ListOflevelISets[index] || prev.ListOflevelMyManagerSet[index]),
                    }))
                    //['Analytical', 'Creative', 'Soft', 'Managerial', 'Interpersonal', 'Technical']
                    setSkillsRadar({
                        ...skillsRadar,
                        Average: [
                            data[0].skills.reduce((acc, skill) => skill.type === 'Analytical' ? acc + (skill.levelISet + skill.levelMyManagerSet) / 2 : acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Creative' ? acc + (skill.levelISet + skill.levelMyManagerSet) / 2 : acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Soft' ? acc + (skill.levelISet + skill.levelMyManagerSet) / 2 : acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Managerial' ? acc + (skill.levelISet + skill.levelMyManagerSet) / 2 : acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Interpersonal' ? acc + (skill.levelISet + skill.levelMyManagerSet) / 2 : acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Technical' ? acc + (skill.levelISet + skill.levelMyManagerSet) / 2 : acc, 0),
                        ],
                        ManagerSets: [
                            data[0].skills.reduce((acc, skill) => skill.type === 'Analytical' ? acc + skill.levelMyManagerSet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Creative' ? acc + skill.levelMyManagerSet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Soft' ? acc + skill.levelMyManagerSet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Managerial' ? acc + skill.levelMyManagerSet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Interpersonal' ? acc + skill.levelMyManagerSet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Technical' ? acc + skill.levelMyManagerSet: acc, 0),
                        ],
                        ISet: [
                            data[0].skills.reduce((acc, skill) => skill.type === 'Analytical' ? acc + skill.levelISet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Creative' ? acc + skill.levelISet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Soft' ? acc + skill.levelISet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Managerial' ? acc + skill.levelISet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Interpersonal' ? acc + skill.levelISet: acc, 0),
                            data[0].skills.reduce((acc, skill) => skill.type === 'Technical' ? acc + skill.levelISet: acc, 0),
                        ]


                        // AnalyticalManager: data[0].skills.reduce((acc, skill) => skill.type === 'Analytical' ? acc + skill.levelMyManagerSet: acc, 0),
                        // CreativeManager: data[0].skills.reduce((acc, skill) => skill.type === 'Creative' ? acc + skill.levelMyManagerSet: acc, 0),
                        // SoftManager: data[0].skills.reduce((acc, skill) => skill.type === 'Soft' ? acc + skill.levelMyManagerSet: acc, 0),
                        // ManagerialManager: data[0].skills.reduce((acc, skill) => skill.type === 'Managerial' ? acc + skill.levelMyManagerSet: acc, 0),
                        // InterpersonalManager: data[0].skills.reduce((acc, skill) => skill.type === 'Interpersonal' ? acc + skill.levelMyManagerSet: acc, 0),
                        // TechnicalManager: data[0].skills.reduce((acc, skill) => skill.type === 'Technical' ? acc + skill.levelMyManagerSet: acc, 0),
                        
                        // AnalyticalMySelf: data[0].skills.reduce((acc, skill) => skill.type === 'Analytical' ? acc + skill.levelISet: acc, 0),
                        // CreativeMySelf: data[0].skills.reduce((acc, skill) => skill.type === 'Creative' ? acc + skill.levelISet: acc, 0),
                        // SoftMySelf: data[0].skills.reduce((acc, skill) => skill.type === 'Soft' ? acc + skill.levelISet: acc, 0),
                        // ManagerialMySelf: data[0].skills.reduce((acc, skill) => skill.type === 'Managerial' ? acc + skill.levelISet: acc, 0),
                        // InterpersonalMySelf: data[0].skills.reduce((acc, skill) => skill.type === 'Interpersonal' ? acc + skill.levelISet: acc, 0),
                        // TechnicalMySelf: data[0].skills.reduce((acc, skill) => skill.type === 'Technical' ? acc + skill.levelISet: acc, 0),
                    });
            } catch(e) {
                console.log("error: ",e);
            }
  
            // Fetch the profile data from the backend
        }
        getData();
    }, []);

    function formatDate(d){
        const date = new Date(d);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        return formattedDate;
    }

    const projects = [
        {
            id: 1,
            title: "Chat App Update",
            updatedTime: "2 year Ago",
            badgeText: "Inprogress",
            badgeClass: "warning",
            member: [
                {
                    id: 1,
                    img: avatar1
                },
                {
                    id: 2,
                    img: avatar3
                }
            ],
            cardBorderColor: "warning",
            memberName: [
                {
                    id: 1,
                    memberText: "J"
                }
            ]
        },
        {
            id: 2,
            title: "ABC Project Customization",
            updatedTime: "2 month Ago",
            badgeText: "Progress",
            badgeClass: "primary",
            member: [
                {
                    id: 1,
                    img: avatar8
                },
                {
                    id: 2,
                    img: avatar7
                },
                {
                    id: 3,
                    img: avatar6
                },
            ],
            cardBorderColor: "success",
            memberName: [
                {
                    id: 1,
                    memberText: "2+"
                }
            ]
        },
        {
            id: 3,
            title: "Client - Frank Hook",
            updatedTime: "1 hr Ago",
            badgeText: "New",
            badgeClass: "info",
            member: [
                {
                    id: 1,
                    img: avatar4
                },
                {
                    id: 2,
                    img: avatar3
                },

            ],
            cardBorderColor: "info",
            memberName: [
                {
                    id: 1,
                    memberText: "M"
                }
            ]
        },
        {
            id: 4,
            title: "Velzon Project",
            updatedTime: "11 hr Ago",
            badgeText: "Completed",
            badgeClass: "success",
            member: [
                {
                    id: 1,
                    img: avatar7
                },
                {
                    id: 2,
                    img: avatar5
                },

            ],
            cardBorderColor: "primary",
        },
        {
            id: 5,
            title: "Brand Logo Design",
            updatedTime: "10 min Ago",
            badgeText: "New",
            badgeClass: "info",
            member: [
                {
                    id: 1,
                    img: avatar7
                },
                {
                    id: 2,
                    img: avatar6
                },

            ],
            cardBorderColor: "danger",
            memberName: [
                {
                    id: 1,
                    memberText: "E"
                }
            ]
        },
        {
            id: 6,
            title: "Chat App",
            updatedTime: "8 hr Ago",
            badgeText: "Inprogress",
            badgeClass: "warning",
            member: [
                {
                    id: 1,
                    img: avatar3
                },
                {
                    id: 2,
                    img: avatar8
                },
            ],
            memberName: [
                {
                    id: 1,
                    memberText: "R"
                }
            ],
            cardBorderColor: "primary"
        },
        {
            id: 7,
            title: "Project Update",
            updatedTime: "48 min Ago",
            badgeText: "Inprogress",
            badgeClass: "warning",
            member: [
                {
                    id: 1,
                    img: avatar6
                },
                {
                    id: 2,
                    img: avatar5
                },
                {
                    id: 3,
                    img: avatar4
                },
            ],
            cardBorderColor: "warning"
        },
        {
            id: 8,
            title: "Client - Jennifer",
            updatedTime: "30 min Ago",
            badgeText: "Process",
            badgeClass: "primary",
            member: [
                {
                    id: 1,
                    img: avatar1
                }
            ],
            cardBorderColor: "success"
        },
        {
            id: 9,
            title: "Business Template -UI/UX design",
            updatedTime: "7 month Ago",
            badgeText: "Completed",
            badgeClass: "success",
            member: [
                {
                    id: 1,
                    img: avatar2
                },
                {
                    id: 2,
                    img: avatar3
                },
                {
                    id: 3,
                    img: avatar4
                }
            ],
            cardBorderColor: "info",
            memberName: [
                {
                    id: 1,
                    memberText: "2+"
                }
            ]
        },
        {
            id: 10,
            title: "Update Project",
            updatedTime: "1 month Ago",
            badgeText: "New",
            badgeClass: "info",
            member: [
                {
                    id: 1,
                    img: avatar7
                }
            ],
            memberName: [
                {
                    id: 1,
                    memberText: "A"
                }
            ],
            cardBorderColor: "success"
        },
        {
            id: 11,
            title: "Bank Management System",
            updatedTime: "10 month Ago",
            badgeText: "Completed",
            badgeClass: "success",
            member: [
                {
                    id: 1,
                    img: avatar7
                },
                {
                    id: 2,
                    img: avatar6
                },
                {
                    id: 3,
                    img: avatar5
                }
            ],
            cardBorderColor: "danger",
            memberName: [
                {
                    id: 1,
                    memberText: "2+"
                }
            ]
        },
        {
            id: 12,
            title: "PSD to HTML Convert",
            updatedTime: "29 min Ago",
            badgeText: "New",
            badgeClass: "info",
            member: [
                {
                    id: 1,
                    img: avatar7
                }
            ],
            cardBorderColor: "primary"
        },

    ];

    const document = [
        {
            id: 1,
            icon: "ri-file-zip-fill",
            iconBackgroundClass: "primary",
            fileName: "Artboard-documents.zip",
            fileType: "Zip File",
            fileSize: "4.57 MB",
            updatedDate: "12 Dec 2021"
        },
        {
            id: 2,
            icon: "ri-file-pdf-fill",
            iconBackgroundClass: "danger",
            fileName: "Bank Management System",
            fileType: "PDF File",
            fileSize: "8.89 MB",
            updatedDate: "24 Nov 2021"
        },
        {
            id: 3,
            icon: "ri-video-line",
            iconBackgroundClass: "secondary",
            fileName: "Tour-video.mp4",
            fileType: "MP4 File",
            fileSize: "14.62 MB",
            updatedDate: "19 Nov 2021"
        },
        {
            id: 4,
            icon: "ri-file-excel-fill",
            iconBackgroundClass: "secondary",
            fileName: "Tour-video.mp4",
            fileType: "XSL File",
            fileSize: "2.38 KB",
            updatedDate: "14 Nov 2021"
        },
        {
            id: 5,
            icon: "ri-folder-line",
            iconBackgroundClass: "info",
            fileName: "Project Screenshots Collection",
            fileType: "Folder File",
            fileSize: "87.24 MB",
            updatedDate: "08 Nov 2021"
        },
        {
            id: 6,
            icon: "ri-image-2-fill",
            iconBackgroundClass: "danger",
            fileName: "Velzon-logo.png",
            fileType: "PNG File",
            fileSize: "879 KB",
            updatedDate: "02 Nov 2021"
        },
    ];
    SwiperCore.use([Autoplay]);

    const [activeTab, setActiveTab] = useState('1');
    const [activityTab, setActivityTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const toggleActivityTab = (tab) => {
        if (activityTab !== tab) {
            setActivityTab(tab);
        }
    };

    document.title="Profile | Velzon - React Admin & Dashboard Template";

    if (!profile) {
        return <div>Loading profile data...</div>;
    }

    return (
        <>
            <Box className="page-content">
                <Container fluid>
                    <Box className="profile-foreground position-relative mx-n4 mt-n4">
                        <Box className="profile-wid-bg">
                            <img src={"http://localhost:5000/images/cover/default.png"} alt="" className="profile-wid-img" />
                        </Box>
                    </Box>
                    <Box className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                        <Row className="g-4">
                            <Box className="col-auto">
                                <Box className="avatar-lg">
                                    <img src={"http://localhost:5000/images/avatar/default.png"} alt="user-img"
                                        className="img-thumbnail rounded-circle" />
                                </Box>
                            </Box>

                            <Col>
                                <Box className="p-2">
                                    <h3 className="text-white mb-1">{profile?.fullName? `${profile?.fullName}` : `${profile?.email}`}</h3>
                                    <p className="text-white-75">{profile?.jobTitle? profile?.jobTitle?.name : "Not set"}</p>
                                    <Box className="hstack text-white-50 gap-1">
                                        <Box className="me-2"><i
                                            className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>California,
                                            United States</Box>
                                        <Box><i
                                            className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>Themesbrand
                                        </Box>
                                    </Box>
                                </Box>
                            </Col>

                            <Col xs={12} className="col-lg-auto order-last order-lg-0">
                                <Row className="text text-white-50 text-center">
                                    <Col lg={6} xs={4}>
                                        <Box className="p-2">
                                            <h4 className="text-white mb-1">24.3K</h4>
                                            <p className="fs-14 mb-0">Followers</p>
                                        </Box>
                                    </Col>
                                    <Col lg={6} xs={4}>
                                        <Box className="p-2">
                                            <h4 className="text-white mb-1">1.3K</h4>
                                            <p className="fs-14 mb-0">Following</p>
                                        </Box>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Box>

                    <Row>
                        <Col lg={12}>
                            <Box>
                                <Box className="d-flex">
                                    <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                href="#overview-tab"
                                                className={classnames({ active: activeTab === '1' })}
                                                onClick={() => { toggleTab('1'); }}
                                            >
                                                <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">Overview</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#statistics"
                                                className={classnames({ active: activeTab === '2' })}
                                                onClick={() => { toggleTab('2'); }}
                                            >
                                                <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">Statistics</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#activities"
                                                className={classnames({ active: activeTab === '3' })}
                                                onClick={() => { toggleTab('3'); }}
                                            >
                                                <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">Activities</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#projects"
                                                className={classnames({ active: activeTab === '4' })}
                                                onClick={() => { toggleTab('4'); }}
                                            >
                                                <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">Projects</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#documents"
                                                className={classnames({ active: activeTab === '5' })}
                                                onClick={() => { toggleTab('5'); }}
                                            >
                                                <i className="ri-folder-4-line d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">Documents</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#addSkill"
                                                className={classnames({ active: activeTab === '6' })}
                                                onClick={() => { toggleTab('6'); }}
                                            >
                                                <FaFolder className="d-inline-block d-md-none" />
                                                <span className="d-none d-md-inline-block">Tests</span>
                                            </NavLink>
                                                {
                                                myAssignedTests?.length && (
                                                <span className="notification-badge" style={{
                                                    position: "relative",
                                                    top: "-40px",
                                                    left: "90px",
                                                    color: "red"
                                                }}>
                                                    <FaBell />
                                                    <span className="notification-count">{myAssignedTests.length}</span>
                                                </span>
                                                )}
                                        </NavItem>
                                    </Nav>
                                    <Box className="flex-shrink-0">
                                        <Link to="settings" className="btn btn-success"><i
                                            className="ri-edit-box-line align-bottom"></i> Edit Profile</Link>
                                    </Box>
                                </Box>

                                <TabContent activeTab={activeTab} className="pt-4">
                                    <TabPane tabId="1">
                                        <Row>
                                            <Col xxl={3}>
                                                <Card>
                                                    <CardBody>
                                                        <h5 className="card-title mb-5">Complete Your Profile</h5>
                                                        <Progress value={30} color="danger" className="animated-progess custom-progress progress-label" ><Box className="label">30%</Box> </Progress>
                                                    </CardBody>
                                                </Card>

                                                <Card>
                                                    <CardBody>
                                                        <h5 className="card-title mb-3">Info</h5>
                                                        <Box className="table-responsive">
                                                            <Table className="table-borderless mb-0">
                                                                <tbody>
                                                                    <tr>
                                                                        <th className="ps-0" scope="row">Full Name :</th>
                                                                        <td className="text-muted">{`${profile?.fullName}`}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="ps-0" scope="row">Mobile :</th>
                                                                        <td className="text-muted">{profile?.contact?.phone_number}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="ps-0" scope="row">E-mail :</th>
                                                                        <td className="text-muted">{profile?.email}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="ps-0" scope="row">Location :</th>
                                                                        <td className="text-muted">{profile?.contact?.country}, {profile?.contact?.city}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="ps-0" scope="row">Joining Date :</th>
                                                                        <td className="text-muted">{formatDate(profile?.join_date)}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Box>
                                                    </CardBody>
                                                </Card>

                                                <Card>
                                                    <CardBody>
                                                        <h5 className="card-title mb-4">Portfolio</h5>
                                                        <Box className="d-flex flex-wrap gap-2">
                                                            <Box>
                                                                <Link to="#" className="avatar-xs d-block">
                                                                    <span
                                                                        className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                                                        <i className="ri-github-fill"></i>
                                                                    </span>
                                                                </Link>
                                                            </Box>
                                                            <Box>
                                                                <Link to="#" className="avatar-xs d-block">
                                                                    <span
                                                                        className="avatar-title rounded-circle fs-16 bg-primary">
                                                                        <i className="ri-global-fill"></i>
                                                                    </span>
                                                                </Link>
                                                            </Box>
                                                            <Box>
                                                                <Link to="#" className="avatar-xs d-block">
                                                                    <span
                                                                        className="avatar-title rounded-circle fs-16 bg-success">
                                                                        <i className="ri-dribbble-fill"></i>
                                                                    </span>
                                                                </Link>
                                                            </Box>
                                                            <Box>
                                                                <Link to="#" className="avatar-xs d-block">
                                                                    <span
                                                                        className="avatar-title rounded-circle fs-16 bg-danger">
                                                                        <i className="ri-pinterest-fill"></i>
                                                                    </span>
                                                                </Link>
                                                            </Box>
                                                        </Box>
                                                    </CardBody>
                                                </Card>

                                                <Card>
                                                    <CardBody>
                                                        <h5 className="card-title mb-4">Skills</h5>
                                                        <Box className="d-flex flex-wrap gap-2 fs-15">
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">Photoshop</Link>
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">illustrator</Link>
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">HTML</Link>
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">CSS</Link>
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">Javascript</Link>
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">Php</Link>
                                                            <Link to="#"
                                                                className="badge badge-soft-primary">Python</Link>
                                                        </Box>
                                                    </CardBody>
                                                </Card>

                                                <Card>
                                                    <CardBody>
                                                        <Box className="d-flex align-items-center mb-4">
                                                            <Box className="flex-grow-1">
                                                                <h5 className="card-title mb-0">Suggestions</h5>
                                                            </Box>
                                                            <Box className="flex-shrink-0">

                                                                <UncontrolledDropdown direction='start'>
                                                                    <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
                                                                        <i className="ri-more-2-fill fs-14"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu>
                                                                        <DropdownItem>View</DropdownItem>
                                                                        <DropdownItem>Edit</DropdownItem>
                                                                        <DropdownItem>Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>

                                                            </Box>
                                                        </Box>
                                                        <Box>
                                                            <Box className="d-flex align-items-center py-3">
                                                                <Box className="avatar-xs flex-shrink-0 me-3">
                                                                    <img src={avatar3} alt=""
                                                                        className="img-fluid rounded-circle" />
                                                                </Box>
                                                                <Box className="flex-grow-1">
                                                                    <Box>
                                                                        <h5 className="fs-14 mb-1">Esther James</h5>
                                                                        <p className="fs-13 text-muted mb-0">Frontend
                                                                            Developer</p>
                                                                    </Box>
                                                                </Box>
                                                                <Box className="flex-shrink-0 ms-2">
                                                                    <button type="button"
                                                                        className="btn btn-sm btn-outline-success"><i
                                                                            className="ri-user-add-line align-middle"></i></button>
                                                                </Box>
                                                            </Box>
                                                            <Box className="d-flex align-items-center py-3">
                                                                <Box className="avatar-xs flex-shrink-0 me-3">
                                                                    <img src={avatar4} alt=""
                                                                        className="img-fluid rounded-circle" />
                                                                </Box>
                                                                <Box className="flex-grow-1">
                                                                    <Box>
                                                                        <h5 className="fs-14 mb-1">Jacqueline Steve</h5>
                                                                        <p className="fs-13 text-muted mb-0">UI/UX Designer
                                                                        </p>
                                                                    </Box>
                                                                </Box>
                                                                <Box className="flex-shrink-0 ms-2">
                                                                    <button type="button"
                                                                        className="btn btn-sm btn-outline-success"><i
                                                                            className="ri-user-add-line align-middle"></i></button>
                                                                </Box>
                                                            </Box>
                                                            <Box className="d-flex align-items-center py-3">
                                                                <Box className="avatar-xs flex-shrink-0 me-3">
                                                                    <img src={avatar5} alt=""
                                                                        className="img-fluid rounded-circle" />
                                                                </Box>
                                                                <Box className="flex-grow-1">
                                                                    <Box>
                                                                        <h5 className="fs-14 mb-1">George Whalen</h5>
                                                                        <p className="fs-13 text-muted mb-0">Backend
                                                                            Developer</p>
                                                                    </Box>
                                                                </Box>
                                                                <Box className="flex-shrink-0 ms-2">
                                                                    <button type="button"
                                                                        className="btn btn-sm btn-outline-success"><i
                                                                            className="ri-user-add-line align-middle"></i></button>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </CardBody>
                                                </Card>


                                                <Card>
                                                    <CardBody>
                                                        <Box className="d-flex align-items-center mb-4">
                                                            <Box className="flex-grow-1">
                                                                <h5 className="card-title mb-0">Popular Posts</h5>
                                                            </Box>
                                                            <Box className="flex-shrink-0">
                                                                <UncontrolledDropdown direction='start'>
                                                                    <DropdownToggle tag="a" id="dropdownMenuLink1" role="button">
                                                                        <i className="ri-more-2-fill fs-14"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu>
                                                                        <DropdownItem>View</DropdownItem>
                                                                        <DropdownItem>Edit</DropdownItem>
                                                                        <DropdownItem>Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </Box>
                                                        </Box>
                                                        <Box className="d-flex mb-4">
                                                            <Box className="flex-shrink-0">
                                                                <img src={smallImage4} alt=""
                                                                    height="50" className="rounded" />
                                                            </Box>
                                                            <Box className="flex-grow-1 ms-3 overflow-hidden">
                                                                <Link to="#">
                                                                    <h6 className="text-truncate fs-14">Design your apps in
                                                                        your own way</h6>
                                                                </Link>
                                                                <p className="text-muted mb-0">15 Dec 2021</p>
                                                            </Box>
                                                        </Box>
                                                        <Box className="d-flex mb-4">
                                                            <Box className="flex-shrink-0">
                                                                <img src={smallImage5} alt=""
                                                                    height="50" className="rounded" />
                                                            </Box>
                                                            <Box className="flex-grow-1 ms-3 overflow-hidden">
                                                                <Link to="#">
                                                                    <h6 className="text-truncate fs-14">Smartest
                                                                        Applications for Business</h6>
                                                                </Link>
                                                                <p className="text-muted mb-0">28 Nov 2021</p>
                                                            </Box>
                                                        </Box>
                                                        <Box className="d-flex">
                                                            <Box className="flex-shrink-0">
                                                                <img src={smallImage6} alt=""
                                                                    height="50" className="rounded" />
                                                            </Box>
                                                            <Box className="flex-grow-1 ms-3 overflow-hidden">
                                                                <Link to="#">
                                                                    <h6 className="text-truncate fs-14">How to get creative
                                                                        in your work</h6>
                                                                </Link>
                                                                <p className="text-muted mb-0">21 Nov 2021</p>
                                                            </Box>
                                                        </Box>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xxl={9}>
                                                <Card>
                                                    <CardBody>
                                                        {
                                                            profile?.about? 
                                                            <>
                                                                <h5 className="card-title mb-3">About</h5>
                                                                <p>{profile?.about}</p>                       
                                                            </>
                                                            : null
                                                        }
                                                        <Row>
                                                            <Col xs={6} md={4}>
                                                                <Box className="d-flex mt-4">
                                                                    <Box
                                                                        className="flex-shrink-0 avatar-xs align-self-center me-3">
                                                                        <Box
                                                                            className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                                                            <i className="ri-user-2-fill"></i>
                                                                        </Box>
                                                                    </Box>
                                                                    <Box className="flex-grow-1 overflow-hidden">
                                                                        <p className="mb-1">Designation :</p>
                                                                        <h6 className="text-truncate mb-0"> { profile?.designation } </h6>
                                                                    </Box>
                                                                </Box>
                                                            </Col>

                                                            <Col xs={6} md={4}>
                                                                <Box className="d-flex mt-4">
                                                                    <Box
                                                                        className="flex-shrink-0 avatar-xs align-self-center me-3">
                                                                        <Box
                                                                            className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                                                            <i className="ri-global-line"></i>
                                                                        </Box>
                                                                    </Box>
                                                                    <Box className="flex-grow-1 overflow-hidden">
                                                                        <p className="mb-1">Website :</p>
                                                                        <Link to="#" className="fw-semibold">{ profile?.contact?.website }</Link>
                                                                    </Box>
                                                                </Box>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>

                                                <Row>
                                                    <Col lg={12}>
                                                        <Card>
                                                            <CardHeader className="align-items-center d-flex">
                                                                <h4 className="card-title mb-0  me-2">Recent Activity</h4>
                                                                <Box className="flex-shrink-0 ms-auto">
                                                                    <Nav className="justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                                                        role="tablist">
                                                                        <NavItem>
                                                                            <NavLink
                                                                                to="#today-tab"
                                                                                className={classnames({ active: activityTab === '1' })}
                                                                                onClick={() => { toggleActivityTab('1'); }}
                                                                            >
                                                                                Today
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                to="#weekly-tab"
                                                                                className={classnames({ active: activityTab === '2' })}
                                                                                onClick={() => { toggleActivityTab('2'); }}
                                                                            >
                                                                                Weekly
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem className="nav-item">
                                                                            <NavLink
                                                                                to="#monthly-tab"
                                                                                className={classnames({ active: activityTab === '3' })}
                                                                                onClick={() => { toggleActivityTab('3'); }}
                                                                            >
                                                                                Monthly
                                                                            </NavLink>
                                                                        </NavItem>
                                                                    </Nav>
                                                                </Box>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <TabContent activeTab={activityTab} className="text-muted">
                                                                    <TabPane tabId="1">
                                                                        <Box className="profile-timeline">
                                                                            <Box>
                                                                            </Box>
                                                                            <Box className="accordion accordion-flush" id="todayExample">
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header">
                                                                                        <button className="accordion-button p-2 shadow-none" type="button" id="headingOne" >
                                                                                            <Box className="d-flex">
                                                                                                <Box className="flex-shrink-0">
                                                                                                    <img src={avatar2} alt="" className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Jacqueline Steve
                                                                                                    </h6>
                                                                                                    <small className="text-muted">We has changed 2 attributes on 05:16PM</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </button>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse className="accordion-collapse" toggler="#headingOne" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            In an awareness campaign, it
                                                                                            is vital for people to begin
                                                                                            put 2 and 2 together and
                                                                                            begin to recognize your
                                                                                            cause. Too much or too
                                                                                            little spacing, as in the
                                                                                            example below, can make
                                                                                            things unpleasant for the
                                                                                            reader. The goal is to make
                                                                                            your text as comfortable to
                                                                                            read as possible. A
                                                                                            wonderful serenity has taken
                                                                                            possession of my entire
                                                                                            soul, like these sweet
                                                                                            mornings of spring which I
                                                                                            enjoy with my whole heart.
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header" id="headingTwo">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapseTwo">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0 avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title bg-light text-success rounded-circle">
                                                                                                        M
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Megan Elmore
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Adding
                                                                                                        a new event with
                                                                                                        attachments -
                                                                                                        04:45PM</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="collapseTwo" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            <Row className="g-2">
                                                                                                <Box className="col-auto">
                                                                                                    <Box
                                                                                                        className="d-flex border border-dashed p-2 rounded position-relative">
                                                                                                        <Box
                                                                                                            className="flex-shrink-0">
                                                                                                            <i
                                                                                                                className="ri-image-2-line fs-17 text-danger"></i>
                                                                                                        </Box>
                                                                                                        <Box
                                                                                                            className="flex-grow-1 ms-2">
                                                                                                            <h6><Link to="#"
                                                                                                                className="stretched-link">Business
                                                                                                                Template
                                                                                                                -
                                                                                                                UI/UX
                                                                                                                design</Link>
                                                                                                            </h6>
                                                                                                            <small>685
                                                                                                                KB</small>
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box className="col-auto">
                                                                                                    <Box
                                                                                                        className="d-flex border border-dashed p-2 rounded position-relative">
                                                                                                        <Box
                                                                                                            className="flex-shrink-0">
                                                                                                            <i
                                                                                                                className="ri-file-zip-line fs-17 text-info"></i>
                                                                                                        </Box>
                                                                                                        <Box
                                                                                                            className="flex-grow-1 ms-2">
                                                                                                            <h6><Link to="#"
                                                                                                                className="stretched-link">Bank
                                                                                                                Management
                                                                                                                System
                                                                                                                -
                                                                                                                PSD</Link>
                                                                                                            </h6>
                                                                                                            <small>8.78
                                                                                                                MB</small>
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            </Row>
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="headingThree">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar5}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        New ticket
                                                                                                        received</h6>
                                                                                                    <small
                                                                                                        className="text-muted mb-2">User
                                                                                                        <span
                                                                                                            className="text-secondary">Erica245</span>
                                                                                                        submitted a
                                                                                                        ticket -
                                                                                                        02:33PM</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="headingFour">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapseFour" >
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0 avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title bg-light text-muted rounded-circle">
                                                                                                        <i
                                                                                                            className="ri-user-3-fill"></i>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Nancy Martino
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Commented
                                                                                                        on
                                                                                                        12:57PM</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="collapseFour" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            " A wonderful serenity has
                                                                                            taken possession of my
                                                                                            entire soul, like these
                                                                                            sweet mornings of spring
                                                                                            which I enjoy with my whole
                                                                                            heart. Each design is a new,
                                                                                            unique piece of art birthed
                                                                                            into this world, and while
                                                                                            you have the opportunity to
                                                                                            be creative and make your
                                                                                            own style choices. "
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="headingFive">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapseFive" >
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar7}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Lewis Arnold
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Create
                                                                                                        new project
                                                                                                        buildng product
                                                                                                        -
                                                                                                        10:05AM</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="collapseFive" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            <p className="text-muted mb-2">
                                                                                                Every team project can
                                                                                                have a velzon. Use the
                                                                                                velzon to share
                                                                                                information with your
                                                                                                team to understand and
                                                                                                contribute to your
                                                                                                project.</p>
                                                                                            <Box className="avatar-group">
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title="Christi">
                                                                                                    <img src={avatar4}
                                                                                                        alt=""
                                                                                                        className="rounded-circle avatar-xs" />
                                                                                                </Link>
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title="Frank Hook">
                                                                                                    <img src={avatar3}
                                                                                                        alt=""
                                                                                                        className="rounded-circle avatar-xs" />
                                                                                                </Link>
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title=" Ruby">
                                                                                                    <Box
                                                                                                        className="avatar-xs">
                                                                                                        <Box
                                                                                                            className="avatar-title rounded-circle bg-light text-primary">
                                                                                                            R
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Link>
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title="more">
                                                                                                    <Box
                                                                                                        className="avatar-xs">
                                                                                                        <Box
                                                                                                            className="avatar-title rounded-circle">
                                                                                                            2+
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Link>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                            </Box>

                                                                        </Box>
                                                                    </TabPane>
                                                                    <TabPane tabId="2">
                                                                        <Box className="profile-timeline">
                                                                            <Box className="accordion accordion-flush"
                                                                                id="weeklyExample">
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading6">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapse6">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar3}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Joseph Parker
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">New
                                                                                                        people joined
                                                                                                        with our company
                                                                                                        -
                                                                                                        Yesterday</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="#collapse6" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            It makes a statement, it’s
                                                                                            impressive graphic design.
                                                                                            Increase or decrease the
                                                                                            letter spacing depending on
                                                                                            the situation and try, try
                                                                                            again until it looks right,
                                                                                            and each letter has the
                                                                                            perfect spot of its own.
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading7">
                                                                                        <Link className="accordion-button p-2 shadow-none"
                                                                                            data-bs-toggle="collapse"
                                                                                            to="#collapse7"
                                                                                            aria-expanded="false">
                                                                                            <Box className="d-flex">
                                                                                                <Box className="avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title rounded-circle bg-light text-danger">
                                                                                                        <i
                                                                                                            className="ri-shopping-bag-line"></i>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Your order is
                                                                                                        placed <span
                                                                                                            className="badge bg-soft-success text-success align-middle">Completed</span>
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">These
                                                                                                        customers can
                                                                                                        rest assured
                                                                                                        their order has
                                                                                                        been placed - 1
                                                                                                        week Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading8">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none"
                                                                                            id="collapse8" >
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0 avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title bg-light text-success rounded-circle">
                                                                                                        <i
                                                                                                            className="ri-home-3-line"></i>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Velzon admin
                                                                                                        dashboard
                                                                                                        templates layout
                                                                                                        upload</h6>
                                                                                                    <small
                                                                                                        className="text-muted">We
                                                                                                        talked about a
                                                                                                        project on
                                                                                                        linkedin - 1
                                                                                                        week Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="#collapse8" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5 fst-italic">
                                                                                            Powerful, clean & modern
                                                                                            responsive bootstrap 5 admin
                                                                                            template. The maximum file
                                                                                            size for uploads in this
                                                                                            demo :
                                                                                            <Row className="mt-2">
                                                                                                <Col xxl={6}>
                                                                                                    <Row
                                                                                                        className="border border-dashed gx-2 p-2">
                                                                                                        <Col xs={3}>
                                                                                                            <img src={smallImage3} alt="" className="img-fluid rounded" />
                                                                                                        </Col>

                                                                                                        <Col xs={3}>
                                                                                                            <img src={smallImage5} alt="" className="img-fluid rounded" />
                                                                                                        </Col>

                                                                                                        <Col xs={3}>
                                                                                                            <img src={smallImage7} alt="" className="img-fluid rounded" />
                                                                                                        </Col>

                                                                                                        <Col xs={3}>
                                                                                                            <img src={smallImage9} alt="" className="img-fluid rounded" />
                                                                                                        </Col>

                                                                                                    </Row>

                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading9">
                                                                                        <Link className="accordion-button p-2 shadow-none"
                                                                                            data-bs-toggle="collapse"
                                                                                            to="#collapse9"
                                                                                            aria-expanded="false">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar6}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        New ticket
                                                                                                        created <span
                                                                                                            className="badge bg-soft-info text-info align-middle">Inprogress</span>
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted mb-2">User
                                                                                                        <span
                                                                                                            className="text-secondary">Jack365</span>
                                                                                                        submitted a
                                                                                                        ticket - 2 week
                                                                                                        Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading10">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapse10">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar5} alt="" className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Jennifer Carter
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Commented
                                                                                                        - 4 week
                                                                                                        Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="#collapse10" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            <p
                                                                                                className="text-muted fst-italic mb-2">
                                                                                                " This is an awesome
                                                                                                admin dashboard
                                                                                                template. It is
                                                                                                extremely well
                                                                                                structured and uses
                                                                                                state of the art
                                                                                                components (e.g. one of
                                                                                                the only templates using
                                                                                                boostrap 5.1.3 so far).
                                                                                                I integrated it into a
                                                                                                Rails 6 project. Needs
                                                                                                manual integration work
                                                                                                of course but the
                                                                                                template structure made
                                                                                                it easy. "</p>
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                            </Box>

                                                                        </Box>
                                                                    </TabPane>
                                                                    <TabPane tabId="3">
                                                                        <Box className="profile-timeline">
                                                                            <Box className="accordion accordion-flush"
                                                                                id="monthlyExample">
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading11">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapse11" >
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0 avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title bg-light text-success rounded-circle">
                                                                                                        M
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Megan Elmore
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Adding
                                                                                                        a new event with
                                                                                                        attachments - 1
                                                                                                        month
                                                                                                        Ago.</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="#collapse11" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            <Box className="row g-2">
                                                                                                <Box className="col-auto">
                                                                                                    <Box
                                                                                                        className="d-flex border border-dashed p-2 rounded position-relative">
                                                                                                        <Box
                                                                                                            className="flex-shrink-0">
                                                                                                            <i
                                                                                                                className="ri-image-2-line fs-17 text-danger"></i>
                                                                                                        </Box>
                                                                                                        <Box
                                                                                                            className="flex-grow-1 ms-2">
                                                                                                            <h6><Link to="#"
                                                                                                                className="stretched-link">Business
                                                                                                                Template
                                                                                                                -
                                                                                                                UI/UX
                                                                                                                design</Link>
                                                                                                            </h6>
                                                                                                            <small>685
                                                                                                                KB</small>
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box className="col-auto">
                                                                                                    <Box
                                                                                                        className="d-flex border border-dashed p-2 rounded position-relative">
                                                                                                        <Box
                                                                                                            className="flex-shrink-0">
                                                                                                            <i
                                                                                                                className="ri-file-zip-line fs-17 text-info"></i>
                                                                                                        </Box>
                                                                                                        <Box
                                                                                                            className="flex-grow-1 ms-2">
                                                                                                            <h6><Link to="#"
                                                                                                                className="stretched-link">Bank
                                                                                                                Management
                                                                                                                System
                                                                                                                -
                                                                                                                PSD</Link>
                                                                                                            </h6>
                                                                                                            <small>8.78
                                                                                                                MB</small>
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box className="col-auto">
                                                                                                    <Box
                                                                                                        className="d-flex border border-dashed p-2 rounded position-relative">
                                                                                                        <Box
                                                                                                            className="flex-shrink-0">
                                                                                                            <i
                                                                                                                className="ri-file-zip-line fs-17 text-info"></i>
                                                                                                        </Box>
                                                                                                        <Box
                                                                                                            className="flex-grow-1 ms-2">
                                                                                                            <h6><Link to="#"
                                                                                                                className="stretched-link">Bank
                                                                                                                Management
                                                                                                                System
                                                                                                                -
                                                                                                                PSD</Link>
                                                                                                            </h6>
                                                                                                            <small>8.78
                                                                                                                MB</small>
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading12">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none"
                                                                                            id="collapse12"
                                                                                            aria-expanded="true">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar2}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Jacqueline Steve
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">We
                                                                                                        has changed 2
                                                                                                        attributes on 3
                                                                                                        month
                                                                                                        Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="collapse12" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            In an awareness campaign, it
                                                                                            is vital for people to begin
                                                                                            put 2 and 2 together and
                                                                                            begin to recognize your
                                                                                            cause. Too much or too
                                                                                            little spacing, as in the
                                                                                            example below, can make
                                                                                            things unpleasant for the
                                                                                            reader. The goal is to make
                                                                                            your text as comfortable to
                                                                                            read as possible. A
                                                                                            wonderful serenity has taken
                                                                                            possession of my entire
                                                                                            soul, like these sweet
                                                                                            mornings of spring which I
                                                                                            enjoy with my whole heart.
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading13">
                                                                                        <Link className="accordion-button p-2 shadow-none"
                                                                                            data-bs-toggle="collapse"
                                                                                            to="#collapse13"
                                                                                            aria-expanded="false">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar6}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        New ticket
                                                                                                        received</h6>
                                                                                                    <small
                                                                                                        className="text-muted mb-2">User
                                                                                                        <span
                                                                                                            className="text-secondary">Erica245</span>
                                                                                                        submitted a
                                                                                                        ticket - 5 month
                                                                                                        Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading14">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapse14">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0 avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title bg-light text-muted rounded-circle">
                                                                                                        <i
                                                                                                            className="ri-user-3-fill"></i>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Nancy Martino
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Commented
                                                                                                        on 24 Nov,
                                                                                                        2021.</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="#collapse14" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5 fst-italic">
                                                                                            " A wonderful serenity has
                                                                                            taken possession of my
                                                                                            entire soul, like these
                                                                                            sweet mornings of spring
                                                                                            which I enjoy with my whole
                                                                                            heart. Each design is a new,
                                                                                            unique piece of art birthed
                                                                                            into this world, and while
                                                                                            you have the opportunity to
                                                                                            be creative and make your
                                                                                            own style choices. "
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                                <Box className="accordion-item border-0">
                                                                                    <Box className="accordion-header"
                                                                                        id="heading15">
                                                                                        <Link to="#" className="accordion-button p-2 shadow-none" id="collapse15">
                                                                                            <Box className="d-flex">
                                                                                                <Box
                                                                                                    className="flex-shrink-0">
                                                                                                    <img src={avatar7}
                                                                                                        alt=""
                                                                                                        className="avatar-xs rounded-circle" />
                                                                                                </Box>
                                                                                                <Box
                                                                                                    className="flex-grow-1 ms-3">
                                                                                                    <h6
                                                                                                        className="fs-14 mb-1">
                                                                                                        Lewis Arnold
                                                                                                    </h6>
                                                                                                    <small
                                                                                                        className="text-muted">Create
                                                                                                        new project
                                                                                                        buildng product
                                                                                                        - 8 month
                                                                                                        Ago</small>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Link>
                                                                                    </Box>
                                                                                    <UncontrolledCollapse toggler="#collapse15" defaultOpen>
                                                                                        <Box
                                                                                            className="accordion-body ms-2 ps-5">
                                                                                            <p className="text-muted mb-2">
                                                                                                Every team project can
                                                                                                have a velzon. Use the
                                                                                                velzon to share
                                                                                                information with your
                                                                                                team to understand and
                                                                                                contribute to your
                                                                                                project.</p>
                                                                                            <Box className="avatar-group">
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title="Christi">
                                                                                                    <img src={avatar4}
                                                                                                        alt=""
                                                                                                        className="rounded-circle avatar-xs" />
                                                                                                </Link>
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title="Frank Hook">
                                                                                                    <img src={avatar3}
                                                                                                        alt=""
                                                                                                        className="rounded-circle avatar-xs" />
                                                                                                </Link>
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title=" Ruby">
                                                                                                    <Box
                                                                                                        className="avatar-xs">
                                                                                                        <Box
                                                                                                            className="avatar-title rounded-circle bg-light text-primary">
                                                                                                            R
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Link>
                                                                                                <Link to="#"
                                                                                                    className="avatar-group-item"
                                                                                                    data-bs-toggle="tooltip"
                                                                                                    data-bs-trigger="hover"
                                                                                                    data-bs-placement="top"
                                                                                                    title=""
                                                                                                    data-bs-original-title="more">
                                                                                                    <Box
                                                                                                        className="avatar-xs">
                                                                                                        <Box
                                                                                                            className="avatar-title rounded-circle">
                                                                                                            2+
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Link>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </UncontrolledCollapse>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                    </TabPane>
                                                                </TabContent>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>

                                                <Card>
                                                    <CardBody>
                                                        <h5 className="card-title">Projects</h5>
                                                        <Box className="d-flex justify-content-end gap-2 mb-2">
                                                            <Box className="slider-button-prev">
                                                                <Box className="avatar-title fs-18 rounded px-1">
                                                                    <i className="ri-arrow-left-s-line"></i>
                                                                </Box>
                                                            </Box>
                                                            <Box className="slider-button-next">
                                                                <Box className="avatar-title fs-18 rounded px-1">
                                                                    <i className="ri-arrow-right-s-line"></i>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Swiper className="project-swiper"
                                                            slidesPerView={3}
                                                            spaceBetween={20}
                                                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                                                            pagination={{ clickable: true }}
                                                        >

                                                            <Box className="swiper-wrapper">
                                                                <SwiperSlide>
                                                                    <Card
                                                                        className="profile-project-card shadow-none profile-project-success mb-0">
                                                                        <CardBody className="p-4">
                                                                            <Box className="d-flex">
                                                                                <Box
                                                                                    className="flex-grow-1 text-muted overflow-hidden">
                                                                                    <h5
                                                                                        className="fs-14 text-truncate mb-1">
                                                                                        <Link to="#"
                                                                                            className="text-dark">ABC
                                                                                            Project Customization</Link>
                                                                                    </h5>
                                                                                    <p className="text-muted text-truncate mb-0">
                                                                                        Last Update : <span className="fw-semibold text-dark">4 hr Ago</span></p>
                                                                                </Box>
                                                                                <Box className="flex-shrink-0 ms-2">
                                                                                    <Box className="badge badge-soft-warning fs-10">
                                                                                        Inprogress</Box>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box className="d-flex mt-4">
                                                                                <Box className="flex-grow-1">
                                                                                    <Box
                                                                                        className="d-flex align-items-center gap-2">
                                                                                        <Box>
                                                                                            <h5 className="fs-12 text-muted mb-0">
                                                                                                Members :</h5>
                                                                                        </Box>
                                                                                        <Box className="avatar-group">
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar4}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar5}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title rounded-circle bg-light text-primary">
                                                                                                        A
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar2}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardBody>
                                                                    </Card>
                                                                </SwiperSlide>

                                                                <SwiperSlide>
                                                                    <Card className="profile-project-card shadow-none profile-project-danger mb-0">
                                                                        <CardBody className="p-4">
                                                                            <Box className="d-flex">
                                                                                <Box
                                                                                    className="flex-grow-1 text-muted overflow-hidden">
                                                                                    <h5 className="fs-14 text-truncate mb-1">
                                                                                        <Link to="#" className="text-dark">Client - John</Link></h5>
                                                                                    <p className="text-muted text-truncate mb-0">
                                                                                        Last Update : <span
                                                                                            className="fw-semibold text-dark">1
                                                                                            hr Ago</span></p>
                                                                                </Box>
                                                                                <Box className="flex-shrink-0 ms-2">
                                                                                    <Box
                                                                                        className="badge badge-soft-success fs-10">
                                                                                        Completed</Box>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box className="d-flex mt-4">
                                                                                <Box className="flex-grow-1">
                                                                                    <Box
                                                                                        className="d-flex align-items-center gap-2">
                                                                                        <Box>
                                                                                            <h5
                                                                                                className="fs-12 text-muted mb-0">
                                                                                                Members :</h5>
                                                                                        </Box>
                                                                                        <Box className="avatar-group">
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar2}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title rounded-circle bg-light text-primary">
                                                                                                        C
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardBody>
                                                                    </Card>
                                                                </SwiperSlide>
                                                                <SwiperSlide>
                                                                    <Card
                                                                        className="profile-project-card shadow-none profile-project-info mb-0">
                                                                        <CardBody className="p-4">
                                                                            <Box className="d-flex">
                                                                                <Box
                                                                                    className="flex-grow-1 text-muted overflow-hidden">
                                                                                    <h5
                                                                                        className="fs-14 text-truncate mb-1">
                                                                                        <Link to="#" className="text-dark">Brand logo Design</Link></h5>
                                                                                    <p className="text-muted text-truncate mb-0">
                                                                                        Last Update : <span
                                                                                            className="fw-semibold text-dark">2
                                                                                            hr Ago</span></p>
                                                                                </Box>
                                                                                <Box className="flex-shrink-0 ms-2">
                                                                                    <Box
                                                                                        className="badge badge-soft-warning fs-10">
                                                                                        Inprogress</Box>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box className="d-flex mt-4">
                                                                                <Box className="flex-grow-1">
                                                                                    <Box
                                                                                        className="d-flex align-items-center gap-2">
                                                                                        <Box>
                                                                                            <h5
                                                                                                className="fs-12 text-muted mb-0">
                                                                                                Members :</h5>
                                                                                        </Box>
                                                                                        <Box className="avatar-group">
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar5}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardBody>
                                                                    </Card>
                                                                </SwiperSlide>
                                                                <SwiperSlide>
                                                                    <Card
                                                                        className="profile-project-card shadow-none profile-project-danger mb-0">
                                                                        <CardBody className="p-4">
                                                                            <Box className="d-flex">
                                                                                <Box
                                                                                    className="flex-grow-1 text-muted overflow-hidden">
                                                                                    <h5
                                                                                        className="fs-14 text-truncate mb-1">
                                                                                        <Link to="#"
                                                                                            className="text-dark">Project
                                                                                            update</Link></h5>
                                                                                    <p
                                                                                        className="text-muted text-truncate mb-0">
                                                                                        Last Update : <span
                                                                                            className="fw-semibold text-dark">4
                                                                                            hr Ago</span></p>
                                                                                </Box>
                                                                                <Box className="flex-shrink-0 ms-2">
                                                                                    <Box
                                                                                        className="badge badge-soft-success fs-10">
                                                                                        Completed</Box>
                                                                                </Box>
                                                                            </Box>

                                                                            <Box className="d-flex mt-4">
                                                                                <Box className="flex-grow-1">
                                                                                    <Box
                                                                                        className="d-flex align-items-center gap-2">
                                                                                        <Box>
                                                                                            <h5
                                                                                                className="fs-12 text-muted mb-0">
                                                                                                Members :</h5>
                                                                                        </Box>
                                                                                        <Box className="avatar-group">
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar4}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar5}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardBody>

                                                                    </Card>

                                                                </SwiperSlide>

                                                                <SwiperSlide>
                                                                    <Card className="profile-project-card shadow-none profile-project-warning mb-0">
                                                                        <CardBody className="p-4">
                                                                            <Box className="d-flex">
                                                                                <Box className="flex-grow-1 text-muted overflow-hidden">
                                                                                    <h5 className="fs-14 text-truncate mb-1">
                                                                                        <Link to="#" className="text-dark">Chat App</Link></h5>
                                                                                    <p
                                                                                        className="text-muted text-truncate mb-0">
                                                                                        Last Update : <span
                                                                                            className="fw-semibold text-dark">1
                                                                                            hr Ago</span></p>
                                                                                </Box>
                                                                                <Box className="flex-shrink-0 ms-2">
                                                                                    <Box
                                                                                        className="badge badge-soft-warning fs-10">
                                                                                        Inprogress</Box>
                                                                                </Box>
                                                                            </Box>

                                                                            <Box className="d-flex mt-4">
                                                                                <Box className="flex-grow-1">
                                                                                    <Box
                                                                                        className="d-flex align-items-center gap-2">
                                                                                        <Box>
                                                                                            <h5
                                                                                                className="fs-12 text-muted mb-0">
                                                                                                Members :</h5>
                                                                                        </Box>
                                                                                        <Box className="avatar-group">
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar4}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <img src={avatar5}
                                                                                                        alt=""
                                                                                                        className="rounded-circle img-fluid" />
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box
                                                                                                className="avatar-group-item">
                                                                                                <Box className="avatar-xs">
                                                                                                    <Box
                                                                                                        className="avatar-title rounded-circle bg-light text-primary">
                                                                                                        A
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardBody>
                                                                    </Card>
                                                                </SwiperSlide>
                                                            </Box>
                                                        </Swiper>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane>

                                    <TabPane tabId="2">
                                        <Card>
                                            <CardBody>
                                                <h5 className="card-title mb-3">Statistics</h5>
                                                <Box className="acitivity-timeline">
                                                                                                    
                                                    {/* <Box>
                                                    { skills && <BasicColumn 
                                                            dataColors='["--vz-danger", "--vz-primary", "--vz-success"]' 
                                                            title='level'
                                                            categories={skills.labels}
                                                            names={[skills.ListOflevelISets && "self score", skills.averageList && "Average score", skills.ListOflevelMyManagerSet && "Manager's score"]}
                                                            data={[skills.ListOflevelISets ? skills.ListOflevelISets : [] ,skills.averageList? skills.averageList : [] ,skills.ListOflevelMyManagerSet? skills.ListOflevelMyManagerSet: []]}
                                                            />}
                                                    </Box>
                                                    <Box>
                                                        { skills && 
                                                        <SimpleRadar dataColors='["--vz-success"]'/>}
                                                    </Box> */}

                                                    <Row>
                                                        <Col xl={8}>
                                                            <Card>
                                                                <CardHeader>
                                                                    <h4 className="card-title mb-0" style={{textAlign: "center", color: "#433884"}}>Specific Skills Chart</h4>
                                                                    { skills && <BasicColumn
                                                                        dataColors='["--vz-danger", "--vz-primary", "--vz-success"]' 
                                                                        title='level'
                                                                        categories={skills.labels}
                                                                        names={[skills.ListOflevelISets && "self score", skills.averageList && "Average score", skills.ListOflevelMyManagerSet && "Manager's score"]}
                                                                        data={[skills.ListOflevelISets ? skills.ListOflevelISets : [] ,skills.averageList? skills.averageList : [] ,skills.ListOflevelMyManagerSet? skills.ListOflevelMyManagerSet: []]}
                                                                        />}
                                                                </CardHeader>

                                                                <CardBody>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col xl={4}>
                                                            <Card>
                                                                <CardHeader>
                                                                    <h4 className="card-title mb-0" style={{textAlign: "center", color: "#433884"}}>Core Competencies Chart</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    { skills && 
                                                                        <SimpleRadar
                                                                            categories={['Analytical', 'Creative', 'Soft', 'Managerial', 'Interpersonal', 'Technical']}
                                                                            names={["Series 1", "Series 2", "Series 3"]} 
                                                                            data={[skillsRadar?.ISet, skillsRadar?.Average, skillsRadar?.ManagerSets]}
                                                                            dataColors='["--vz-danger", "--vz-primary", "--vz-success"]'/>
                                                                    }                                                                
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    {/* <Box className="acitivity-item d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar1} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Oliver Phillips <span
                                                                className="badge bg-soft-primary text-primary align-middle">New</span>
                                                            </h6>
                                                            <p className="text-muted mb-2">We talked about a project on linkedin.</p>
                                                            <small className="mb-0 text-muted">Today</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0 avatar-xs acitivity-avatar">
                                                            <Box className="avatar-title bg-soft-success text-success rounded-circle"> N </Box>
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Nancy Martino <span
                                                                className="badge bg-soft-secondary text-secondary align-middle">In
                                                                Progress</span></h6>
                                                            <p className="text-muted mb-2"><i
                                                                className="ri-file-text-line align-middle ms-2"></i>
                                                                Create new project Buildng product</p>
                                                            <Box className="avatar-group mb-2">
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title="Christi">
                                                                    <img src={avatar4} alt=""
                                                                        className="rounded-circle avatar-xs" />
                                                                </Link>
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title="Frank Hook">
                                                                    <img src={avatar3} alt=""
                                                                        className="rounded-circle avatar-xs" />
                                                                </Link>
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title=" Ruby">
                                                                    <Box className="avatar-xs">
                                                                        <Box className="avatar-title rounded-circle bg-light text-primary">R</Box>
                                                                    </Box>
                                                                </Link>
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title="more">
                                                                    <Box className="avatar-xs">
                                                                        <Box className="avatar-title rounded-circle">
                                                                            2+
                                                                        </Box>
                                                                    </Box>
                                                                </Link>
                                                            </Box>
                                                            <small className="mb-0 text-muted">Yesterday</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar2} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Natasha Carey <span className="badge bg-soft-success text-success align-middle">Completed</span>
                                                            </h6>
                                                            <p className="text-muted mb-2">Adding a new event with
                                                                attachments</p>
                                                            <Row >
                                                                <Col xxl={4}>
                                                                    <Box className="row border border-dashed gx-2 p-2 mb-2">
                                                                        <Box className="col-4">
                                                                            <img src={smallImage2}
                                                                                alt="" className="img-fluid rounded" />
                                                                        </Box>

                                                                        <Box className="col-4">
                                                                            <img src={smallImage3}
                                                                                alt="" className="img-fluid rounded" />
                                                                        </Box>

                                                                        <Box className="col-4">
                                                                            <img src={smallImage4}
                                                                                alt="" className="img-fluid rounded" />
                                                                        </Box>

                                                                    </Box>

                                                                </Col>
                                                            </Row>
                                                            <small className="mb-0 text-muted">25 Nov</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar6} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Bethany Johnson</h6>
                                                            <p className="text-muted mb-2">added a new member to velzon
                                                                dashboard</p>
                                                            <small className="mb-0 text-muted">19 Nov</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <Box className="avatar-xs acitivity-avatar">
                                                                <Box
                                                                    className="avatar-title rounded-circle bg-soft-danger text-danger">
                                                                    <i className="ri-shopping-bag-line"></i>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Your order is placed <span
                                                                className="badge bg-soft-danger text-danger align-middle ms-1">Out
                                                                of Delivery</span></h6>
                                                            <p className="text-muted mb-2">These customers can rest assured
                                                                their order has been placed.</p>
                                                            <small className="mb-0 text-muted">16 Nov</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar7} alt=""
                                                                className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Lewis Pratt</h6>
                                                            <p className="text-muted mb-2">They all have something to say
                                                                beyond the words on the page. They can come across as
                                                                casual or neutral, exotic or graphic. </p>
                                                            <small className="mb-0 text-muted">22 Oct</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <Box className="avatar-xs acitivity-avatar">
                                                                <Box
                                                                    className="avatar-title rounded-circle bg-soft-info text-info">
                                                                    <i className="ri-line-chart-line"></i>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Monthly sales report</h6>
                                                            <p className="text-muted mb-2"><span className="text-danger">2 days
                                                                left</span> notification to submit the monthly sales
                                                                report. <Link to="#" className="link-warning text-decoration-underline">Reports
                                                                    Builder</Link></p>
                                                            <small className="mb-0 text-muted">15 Oct</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar8} alt=""
                                                                className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">New ticket received <span
                                                                className="badge bg-soft-success text-success align-middle">Completed</span>
                                                            </h6>
                                                            <p className="text-muted mb-2">User <span
                                                                className="text-secondary">Erica245</span> submitted a
                                                                ticket.</p>
                                                            <small className="mb-0 text-muted">26 Aug</small>
                                                        </Box>
                                                    </Box> */}
                                                </Box>
                                            </CardBody>
                                        </Card>
                                    </TabPane>

                                    <TabPane tabId="3">
                                        <Card>
                                            <CardBody>
                                                <h5 className="card-title mb-3">Activities</h5>
                                                <Box className="acitivity-timeline">
                                                    <Box className="acitivity-item d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar1} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Oliver Phillips <span
                                                                className="badge bg-soft-primary text-primary align-middle">New</span>
                                                            </h6>
                                                            <p className="text-muted mb-2">We talked about a project on linkedin.</p>
                                                            <small className="mb-0 text-muted">Today</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0 avatar-xs acitivity-avatar">
                                                            <Box className="avatar-title bg-soft-success text-success rounded-circle"> N </Box>
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Nancy Martino <span
                                                                className="badge bg-soft-secondary text-secondary align-middle">In
                                                                Progress</span></h6>
                                                            <p className="text-muted mb-2"><i
                                                                className="ri-file-text-line align-middle ms-2"></i>
                                                                Create new project Buildng product</p>
                                                            <Box className="avatar-group mb-2">
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title="Christi">
                                                                    <img src={avatar4} alt=""
                                                                        className="rounded-circle avatar-xs" />
                                                                </Link>
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title="Frank Hook">
                                                                    <img src={avatar3} alt=""
                                                                        className="rounded-circle avatar-xs" />
                                                                </Link>
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title=" Ruby">
                                                                    <Box className="avatar-xs">
                                                                        <Box className="avatar-title rounded-circle bg-light text-primary">R</Box>
                                                                    </Box>
                                                                </Link>
                                                                <Link to="#" className="avatar-group-item"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="" data-bs-original-title="more">
                                                                    <Box className="avatar-xs">
                                                                        <Box className="avatar-title rounded-circle">
                                                                            2+
                                                                        </Box>
                                                                    </Box>
                                                                </Link>
                                                            </Box>
                                                            <small className="mb-0 text-muted">Yesterday</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar2} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Natasha Carey <span className="badge bg-soft-success text-success align-middle">Completed</span>
                                                            </h6>
                                                            <p className="text-muted mb-2">Adding a new event with
                                                                attachments</p>
                                                            <Row >
                                                                <Col xxl={4}>
                                                                    <Box className="row border border-dashed gx-2 p-2 mb-2">
                                                                        <Box className="col-4">
                                                                            <img src={smallImage2}
                                                                                alt="" className="img-fluid rounded" />
                                                                        </Box>

                                                                        <Box className="col-4">
                                                                            <img src={smallImage3}
                                                                                alt="" className="img-fluid rounded" />
                                                                        </Box>

                                                                        <Box className="col-4">
                                                                            <img src={smallImage4}
                                                                                alt="" className="img-fluid rounded" />
                                                                        </Box>

                                                                    </Box>

                                                                </Col>
                                                            </Row>
                                                            <small className="mb-0 text-muted">25 Nov</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar6} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Bethany Johnson</h6>
                                                            <p className="text-muted mb-2">added a new member to velzon
                                                                dashboard</p>
                                                            <small className="mb-0 text-muted">19 Nov</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <Box className="avatar-xs acitivity-avatar">
                                                                <Box
                                                                    className="avatar-title rounded-circle bg-soft-danger text-danger">
                                                                    <i className="ri-shopping-bag-line"></i>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Your order is placed <span
                                                                className="badge bg-soft-danger text-danger align-middle ms-1">Out
                                                                of Delivery</span></h6>
                                                            <p className="text-muted mb-2">These customers can rest assured
                                                                their order has been placed.</p>
                                                            <small className="mb-0 text-muted">16 Nov</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar7} alt=""
                                                                className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Lewis Pratt</h6>
                                                            <p className="text-muted mb-2">They all have something to say
                                                                beyond the words on the page. They can come across as
                                                                casual or neutral, exotic or graphic. </p>
                                                            <small className="mb-0 text-muted">22 Oct</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item py-3 d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <Box className="avatar-xs acitivity-avatar">
                                                                <Box
                                                                    className="avatar-title rounded-circle bg-soft-info text-info">
                                                                    <i className="ri-line-chart-line"></i>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">Monthly sales report</h6>
                                                            <p className="text-muted mb-2"><span className="text-danger">2 days
                                                                left</span> notification to submit the monthly sales
                                                                report. <Link to="#" className="link-warning text-decoration-underline">Reports
                                                                    Builder</Link></p>
                                                            <small className="mb-0 text-muted">15 Oct</small>
                                                        </Box>
                                                    </Box>
                                                    <Box className="acitivity-item d-flex">
                                                        <Box className="flex-shrink-0">
                                                            <img src={avatar8} alt=""
                                                                className="avatar-xs rounded-circle acitivity-avatar" />
                                                        </Box>
                                                        <Box className="flex-grow-1 ms-3">
                                                            <h6 className="mb-1">New ticket received <span
                                                                className="badge bg-soft-success text-success align-middle">Completed</span>
                                                            </h6>
                                                            <p className="text-muted mb-2">User <span
                                                                className="text-secondary">Erica245</span> submitted a
                                                                ticket.</p>
                                                            <small className="mb-0 text-muted">26 Aug</small>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </CardBody>
                                        </Card>
                                    </TabPane>

                                    <TabPane tabId="4">
                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    {(projects || []).map((item, key) => (
                                                        <Col xxl={3} sm={6} key={key}>
                                                            <Card className={`profile-project-card shadow-none profile-project-${item.cardBorderColor}`}>
                                                                <CardBody className="p-4">
                                                                    <Box className="d-flex">
                                                                        <Box className="flex-grow-1 text-muted overflow-hidden">
                                                                            <h5 className="fs-14 text-truncate"><Link to="#"
                                                                                className="text-dark">{item.title}</Link>
                                                                            </h5>
                                                                            <p className="text-muted text-truncate mb-0">Last
                                                                                Update : <span
                                                                                    className="fw-semibold text-dark">{item.updatedTime}</span></p>
                                                                        </Box>
                                                                        <Box className="flex-shrink-0 ms-2">
                                                                            <Box className={`badge badge-soft-${item.badgeClass} fs-10`}>
                                                                                {item.badgeText}</Box>
                                                                        </Box>
                                                                    </Box>

                                                                    <Box className="d-flex mt-4">
                                                                        <Box className="flex-grow-1">
                                                                            <Box className="d-flex align-items-center gap-2">
                                                                                <Box>
                                                                                    <h5 className="fs-12 text-muted mb-0">
                                                                                        Members :</h5>
                                                                                </Box>
                                                                                <Box className="avatar-group">
                                                                                    {(item.member || []).map((subitem, key) => (
                                                                                        <Box className="avatar-group-item" key={key}>
                                                                                            <Box className="avatar-xs">
                                                                                                <img src={subitem.img} alt="" className="rounded-circle img-fluid" />
                                                                                            </Box>
                                                                                        </Box>
                                                                                    ))}

                                                                                    {(item.memberName || []).map((element, key) => (
                                                                                        <Box className="avatar-group-item" key={key}>
                                                                                            <Box className="avatar-xs">
                                                                                                <Box
                                                                                                    className="avatar-title rounded-circle bg-light text-primary">
                                                                                                    {element.memberText}
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    ))}
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                    <Col lg={12}>
                                                        <Pagination listClassName="justify-content-center" className="pagination-separated mb-0">
                                                            <PaginationItem disabled> <PaginationLink to="#"> <i className="mdi mdi-chevron-left" /> </PaginationLink> </PaginationItem>
                                                            <PaginationItem active> <PaginationLink to="#"> 1 </PaginationLink> </PaginationItem>
                                                            <PaginationItem> <PaginationLink to="#"> 2 </PaginationLink> </PaginationItem>
                                                            <PaginationItem> <PaginationLink to="#"> 3 </PaginationLink> </PaginationItem>
                                                            <PaginationItem> <PaginationLink to="#"> 4 </PaginationLink> </PaginationItem>
                                                            <PaginationItem> <PaginationLink to="#"> 5 </PaginationLink> </PaginationItem>
                                                            <PaginationItem> <PaginationLink to="#"> <i className="mdi mdi-chevron-right" /> </PaginationLink> </PaginationItem>
                                                        </Pagination>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </TabPane>

                                    <TabPane tabId="5">
                                        <Card>
                                            <CardBody>
                                                <Box className="d-flex align-items-center mb-4">
                                                    <h5 className="card-title flex-grow-1 mb-0">Documents</h5>
                                                    <Box className="flex-shrink-0">
                                                        <Input className="form-control d-none" type="file" id="formFile" />
                                                        <Label htmlFor="formFile" className="btn btn-danger"><i className="ri-upload-2-fill me-1 align-bottom"></i> Upload
                                                            File</Label>
                                                    </Box>
                                                </Box>
                                                <Row>
                                                    <Col lg={12}>
                                                        <Box className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">File Name</th>
                                                                        <th scope="col">Type</th>
                                                                        <th scope="col">Size</th>
                                                                        <th scope="col">Upload Date</th>
                                                                        <th scope="col">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(document || []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>
                                                                                <Box className="d-flex align-items-center">
                                                                                    <Box className="avatar-sm">
                                                                                        <Box
                                                                                            className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}>
                                                                                            <i className={item.icon}></i>
                                                                                        </Box>
                                                                                    </Box>
                                                                                    <Box className="ms-3 flex-grow-1">
                                                                                        <h6 className="fs-15 mb-0"><Link to="#">{item.fileName}</Link>
                                                                                        </h6>
                                                                                    </Box>
                                                                                </Box>
                                                                            </td>
                                                                            <td>{item.fileType}</td>
                                                                            <td>{item.fileSize}</td>
                                                                            <td>{item.updatedDate}</td>
                                                                            <td>
                                                                                <UncontrolledDropdown direction='start'>
                                                                                    <DropdownToggle tag="a" className="btn btn-light btn-icon" id="dropdownMenuLink15" role="button">
                                                                                        <i className="ri-equalizer-fill"></i>
                                                                                    </DropdownToggle>
                                                                                    <DropdownMenu>
                                                                                        <DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted" />View</DropdownItem>
                                                                                        <DropdownItem><i className="ri-download-2-fill me-2 align-middle text-muted" />Download</DropdownItem>
                                                                                        <DropdownItem divider />
                                                                                        <DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted" />Delete</DropdownItem>
                                                                                    </DropdownMenu>
                                                                                </UncontrolledDropdown>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </Box>
                                                        <Box className="text-center mt-3">
                                                            <Link to="#" className="text-success "><i
                                                                className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                                                                Load more </Link>
                                                        </Box>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </TabPane>

                                    <TabPane tabId="6">
                                        <Card>
                                            <CardBody>
                                                <Box className="d-flex align-items-center mb-4">
                                                    <h5 className="card-title flex-grow-1 mb-0">My Tests</h5>
                                                    <Box className="flex-shrink-0">
                                                        <Input className="form-control d-none" type="file" id="formFile" />
                                                        {/* <Label htmlFor="formFile" className="btn btn-danger"><i className="ri-upload-2-fill me-1 align-bottom"></i> Upload
                                                            File</Label> */}
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Box className="table-responsive">
                                                        <Table className="table-borderless align-middle mb-0">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th scope="col">Test Name</th>
                                                                    <th scope="col">Created By</th>
                                                                    {/* <th scope="col">Upload Date</th> */}
                                                                    <th scope="col">Start date</th>
                                                                    <th scope="col">days left</th>
                                                                    <th scope="col">Status</th>
                                                                    <th scope="col">Verified</th>
                                                                    <th scope="col">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(myAssignedTests || []).map((item, key) => (
                                                                    <tr key={key}>
                                                                        <td>
                                                                            <Box className="d-flex align-items-center">
                                                                                {/* <Box className="avatar-sm">
                                                                                    <Box
                                                                                        className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}>
                                                                                        <i className={item.icon}></i>
                                                                                    </Box>
                                                                                </Box> */}
                                                                                <Box className="ms-3 flex-grow-1">
                                                                                    <h6 className="fs-15 mb-0"><Link to="#">{item.name}</Link>
                                                                                    </h6>
                                                                                </Box>
                                                                            </Box>
                                                                        </td>
                                                                        <td>{item.creator.fullName === profile?.fullName ? "Myself" : item.creator.fullName}</td>
                                                                        {/* <td>{item.updatedDate}</td> */}
                                                                        <td>{transformDate(item.startDate)}</td>
                                                                        { (transformDateToMilliseconds(item.startDate) + transformDaysToMilliseconds(item.duration) - Date.now() > 0)? <td>{transformMillisecondsToDays(transformDateToMilliseconds(item.startDate) + transformDaysToMilliseconds(item.duration) - Date.now())}</td> : <td> - </td>}
                                                                        {
                                                                            ((new Date(item.startDate).getTime() + item.duration * 24 * 60 * 60 * 1000) > Date.now() && (new Date(item.startDate).getTime() -1  <= Date.now()))
                                                                                ? <td style={{ color: (item.AssignedToUsers[0]?.status === 'pending')? "orange" : (item.AssignedToUsers[0]?.status === 'completed')? "green" : 'black' }} >{item.AssignedToUsers[0]?.status}</td>
                                                                                : (new Date(item.startDate).getTime() > Date.now()) ? <td style={{ color: 'blue' }}>Too soon</td> 
                                                                                : <td style={{ color: 'red' }}>Expired</td>
                                                                        }
                                                                        {
                                                                            item.AssignedToUsers[0]?.verifiedStatus === 'pending' ? <td style={{ color: 'black' }}>NO</td> : <td style={{ color: 'green' }}>YES</td>
                                                                        }
                                                                        <td>
                                                                            <UncontrolledDropdown direction='start'>
                                                                                <DropdownToggle tag="a" className="btn btn-light btn-icon" id="dropdownMenuLink15" role="button">
                                                                                    <i className="ri-equalizer-fill"></i>
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted" />View</DropdownItem>
                                                                                    <DropdownItem onClick={(e) => handleStartTest(e, item)} ><i className="ri-download-2-fill me-2 align-middle text-muted"/>Start</DropdownItem>
                                                                                    <DropdownItem divider />
                                                                                    <DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted" />Delete</DropdownItem>
                                                                                </DropdownMenu>
                                                                            </UncontrolledDropdown>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>

                                                        </Table>
                                                        <TakeTestModal open={!!selectedTest} handleCloseModal={() => setSelectedTest(null)} selectedTest={selectedTest} initialSkills={profile?.skills} action={setMyAssignedTests} />
                                                    </Box>
                                                </Box>

                                                <Box className="d-flex align-items-center mb-4" sx={{ marginTop: 5 }}>
                                                    <h5 className="card-title flex-grow-1 mb-0">To Validate Tests</h5>
                                                    <Box className="flex-shrink-0">
                                                        <Input className="form-control d-none" type="file" id="formFile" />
                                                
                                                    </Box>
                                                </Box>
                                                {
                                                    !!toValidateTests.length &&
                                                    <Box>
                                                        <Box className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">Test Name</th>
                                                                        <th scope="col">Assigned To</th>
                                                                        {/* <th scope="col">Upload Date</th> */}
                                                                        <th scope="col">Start date</th>
                                                                        <th scope="col">days left</th>
                                                                        <th scope="col">Status</th>
                                                                        <th scope="col">Verified</th>
                                                                        <th scope="col">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(toValidateTests || []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>
                                                                                <Box className="d-flex align-items-center">
                                                                                    {/* <Box className="avatar-sm">
                                                                                        <Box
                                                                                            className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}>
                                                                                            <i className={item.icon}></i>
                                                                                        </Box>
                                                                                    </Box> */}
                                                                                    <Box className="ms-3 flex-grow-1">
                                                                                        <h6 className="fs-15 mb-0"><Link to="#">{item.name}</Link>
                                                                                        </h6>
                                                                                    </Box>
                                                                                </Box>
                                                                            </td>
                                                                            <td>{item?.AssignedToUsers[0]?.user.email}</td>
                                                                            {/* <td>{item.updatedDate}</td> */}
                                                                            <td>{transformDate(item.startDate)}</td>
                                                                            { (transformDateToMilliseconds(item.startDate) + transformDaysToMilliseconds(item.duration) - Date.now() > 0)? <td>{transformMillisecondsToDays(transformDateToMilliseconds(item.startDate) + transformDaysToMilliseconds(item.duration) - Date.now())}</td> : <td> - </td>}
                                                                            {
                                                                                ((new Date(item.startDate).getTime() + item.duration * 24 * 60 * 60 * 1000) > Date.now() && (new Date(item.startDate).getTime() -1  <= Date.now()))
                                                                                    ? <td style={{ color: (item.AssignedToUsers[0]?.status === 'pending')? "orange" : (item.AssignedToUsers[0]?.status === 'completed')? "green" : 'black' }} >{item.AssignedToUsers[0]?.status}</td>
                                                                                    : (new Date(item.startDate).getTime() > Date.now()) ? <td style={{ color: 'blue' }}>Too soon</td> 
                                                                                    : <td style={{ color: 'red' }}>Expired</td>
                                                                            }
                                                                            {
                                                                                item.AssignedToUsers[0]?.verifiedStatus === 'pending' ? <td style={{ color: 'black' }}>NO</td> : <td style={{ color: 'green' }}>YES</td>
                                                                            }
                                                                    
                                                                            <td>
                                                                                <UncontrolledDropdown direction='start'>
                                                                                    <DropdownToggle tag="a" className="btn btn-light btn-icon" id="dropdownMenuLink15" role="button">
                                                                                        <i className="ri-equalizer-fill"></i>
                                                                                    </DropdownToggle>
                                                                                    <DropdownMenu>
                                                                                        <DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted" />View</DropdownItem>
                                                                                        <DropdownItem onClick={(e) => handleStartTest(e, item)} ><i className="ri-download-2-fill me-2 align-middle text-muted"/>Start</DropdownItem>
                                                                                        <DropdownItem divider />
                                                                                        <DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted" />Delete</DropdownItem>
                                                                                    </DropdownMenu>
                                                                                </UncontrolledDropdown>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>

                                                            </Table>
                                                            <TakeTestModal open={!!selectedTest && selectedTest.type==="toBeValidated"} handleCloseModal={() => setSelectedTest(null)} selectedTest={selectedTest} initialSkills={profile?.skills} type="validation" action={setToValidateTests} />
                                                        </Box>
                                                    </Box>
                                                }
                                                <Row>
    
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </TabPane>
                                </TabContent>
                            </Box>
                        </Col>
                    </Row>

                </Container>
            </Box>
        </>
    );
    function transformDate(dateString){
        const date = new Date(dateString);
    
        // Extract the time
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Extract the date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        
        return formattedDate
    }

    function transformDateToMilliseconds(date){
        return new Date(date).getTime();
    }

    function transformMillisecondsToDays(dateInMilliseconds){
        return Math.ceil(dateInMilliseconds / (1000 * 60 * 60 * 24));
    }

    
    function transformDaysToMilliseconds(dateInDays){
        const date = new Date(dateInDays);
        return date * (1000 * 60 * 60 * 24);
    }
};

export default SimplePage;