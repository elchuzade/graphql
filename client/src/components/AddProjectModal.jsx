import { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { useMutation, useQuery } from '@apollo/client'
import { GET_CLIENTS } from '../queries/clientQueries'
import { ADD_PROJECT } from '../mutations/projectMutations'
import { GET_PROJECTS } from '../queries/projectQueries'
import Spinner from './Spinner'

export default function AddProjectModal() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('new')
  const [clientId, setClientId] = useState('')

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, status, clientId },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({
        query: GET_PROJECTS
      })

      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] }
      })
    }
  })

  // Get clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS)

  const onSubmit = e => {
    e.preventDefault()
    console.log(name, description, status, clientId)
    if (name === '' || description === '' || status === '' || clientId === '') {
      return alert('Please fill in all fields')
    }

    addProject()

    setName('')
    setDescription('')
    setStatus('new')
    setClientId('')
  }

  if (loading) return <Spinner />
  if (error) return <p>Something weng wrong</p>

  return (
    <>
      {!loading && !error && (<>
        <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#addProjectModal'>
          <div className='d-flex align-items-center'>
            <FaList className='icon' />
            <div>New Project</div>
          </div>
        </button>

        <div className='modal' id='addProjectModal' role='dialog' aria-labelledby='addProjectModalLabel' aria-hidden='true'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='addProjectModalLabel'>Add Project</h5>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <form onSubmit={onSubmit}>
                  <div className='mb-3'>
                    <label className='form-label'>Name</label>
                    <input type='text' className='form-control' id='name' value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea type='text' className='form-control' id='description' value={description} onChange={e => setDescription(e.target.value)}></textarea>
                  </div>
                  <div className='mb-3'>
                    <label className='form-label'>Status</label>
                    <select id="status" className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                      <option value='new'>Not Started</option>
                      <option value='progress'>In Progresss</option>
                      <option value='completed'>Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className='form-label'>Clients</label>
                    <select id="clientId" className="form-select" value={clientId} onChange={e => setClientId(e.target.value)}>
                      <option value=''>Select Client</option>
                      {data.clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <button data-bs-dismiss='modal' className='btn btn-primary'>Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>)}
    </>
  )
}
