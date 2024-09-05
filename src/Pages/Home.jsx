import { useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchContests, getContestById } from '../redux/contestSlice'

const Home = () => {
    let dispatch=useDispatch()
    useEffect(()=>{
        dispatch(fetchContests())
    },[])
  return (
    <div>Home</div>
  )
}

export default Home