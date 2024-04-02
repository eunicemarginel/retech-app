import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ArchiveCourse({course, isActive, fetchData}) {

	const archiveToggle = (courseId) => {
		fetch(`http://localhost:4000/courses/${courseId}/archive`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})

		.then(res => res.json())
		.then(data => {
			console.log(data)
			if(data.message === 'Course archived successfully') {
				Swal.fire({
					title: 'Success',
					icon: 'success',
					text: 'Course successfully disabled'
				})
				fetchData();

			}else {
				Swal.fire({
					title: 'Something Went Wrong',
					icon: 'Error',
					text: 'Please Try again'
				})
				fetchData();
			}


		})
	}


	const activateToggle = (courseId) => {
		fetch(`http://localhost:4000/courses/${courseId}/activate`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})

		.then(res => res.json())
		.then(data => {
			console.log(data)
			if(data.message === "Course activated successfully") {
				Swal.fire({
					title: 'Success',
					icon: 'success',
					text: 'Course successfully enabled'
				})
				fetchData();
			}else {
				Swal.fire({
					title: 'Something Went Wrong',
					icon: 'Error',
					text: 'Please Try again'
				})
				fetchData();
			}


		})
	}


	return(
		<>
			{isActive ?

				<Button variant="danger" size="sm" onClick={() => archiveToggle(course)}>Archive</Button>

				:

				<Button variant="success" size="sm" onClick={() => activateToggle(course)}>Activate</Button>

			}
		</>

	)
}