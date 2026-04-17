
// import { useState } from 'react';
// import type { ChangeEvent } from 'react';
// import type { ProjectCreationRequest, RiskRequest } from '../features/project/project.types';


// const CreateProjectForm = () => {
//     const [formData, setFormData] = useState<ProjectCreationRequest>({
//         title: '',
//         description: '',
//         startDate: '',
//         isActive: true,
//         walletId: undefined,
//         programId: undefined,
//         risks: []
//     })

//     const [message, setMessage] = useState('');

//     const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       const {name, value, type} = e.target;
//       if (type === 'checkbox'){
//         const checked = (e.target as HTMLInputElement).checked;
//         setFormData({...formData, [name]: checked});
//       }else{
//         setFormData({ ...formData, [name]: value });
//       }
//     }


//     const addRisk = () => {
//       setFormData({
//         ...formData,
//         risks: [...(formData.risks || []), { name: '', description: '', probability: 0 }],
//       });
//     };

//     const removeRisk = (index:number) => {
//       const updatedRisks = formData.risks?.filter((_, i) => i !== index);
//       setFormData({...formData, risks: updatedRisks})
//     }

//     const handleRiskChange = (index:number, field: keyof RiskRequest, value: string | number) => {
//       const updatedRisks = [...(formData.risks || [])];
//       updatedRisks[index] = { ...updatedRisks[index], [field]: value };
//       setFormData({ ...formData, risks: updatedRisks });
//     }


//     // Bez endpointów narazie - bez backendu

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setMessage('');

//       const payload = {
//         ...formData,
//         walletId: formData.walletId ? Number(formData.walletId) : null,
//         programId: formData.programId ? Number(formData.programId) : null,
//       };

//       console.log('próba wysłania danych: ', payload)
//     }




//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
//       <h2 className='text-2xl font-bold mb-6 text-gray-800'>Utwórz Nowy Projekt</h2>
//       {message && (
//         <div className="p-4 mb-4 rounded bg-green-100 text-green-700">
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className='space-y-6 text-left'>
//         <div className="space-y-4">
//           <div>
//             <label className=''>Nazwa *</label>
//             <input required type="text" name='title' value={formData.title} onChange={handleChange}
//             className='w-full border border-gray-300 rounded p-2 focus:ring-blue-500'
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Opis *</label>
//             <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} 
//             className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Data Startu *</label>
//                 <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange}
//                 className='w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500'
//                 />
//             </div>
//             <div className="flex items-center mt-6">
//               <input type="checkbox" name='isActive' checked={formData.isActive} onChange={handleChange}
//               className='h-4 w-4 text-blue-600 rounded'
//               />
//               <label className='ml-2 block text-sm text-gray-900'>Projekt aktywny</label>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ID Portfela (Opcjonalnie)</label>
//               <input type="number" name="walletId" value={formData.walletId || ''} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ID Programu (Opcjonalnie)</label>
//               <input type="number" name="programId" value={formData.programId || ''} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="pt-6 border-t border-gray-200">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className='text-lg font-semibold text-gray-800'>Ryzyka Projektu</h3>
//             <button type="button" onClick={addRisk} 
//             className='bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer'>
//             + Dodaj Ryzyko</button>
//           </div>

//           {formData.risks?.length === 0 && (
//             <p className="text-sm text-gray-500 italic">Brak dodanych ryzyk.</p>
//           )}

//           <div className="space-y-4">
//             {formData.risks?.map((risk, index) => (
//               <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
//                 <button type='button' onClick={() => removeRisk(index)} className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer'>X Usuń</button>

//                 <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
//                   <div>
//                     <label className='block text-xs font-medium text-gray-700 mb-1'>Nazwa Ryzyka</label>
//                     <input required type="text" value={risk.name} onChange={(e) => handleRiskChange(index, 'name', e.target.value)} className='w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500'/>
//                   </div>
//                   <div>
//                     <label className='block text-xs font-medium text-gray-700 mb-1'>Prawdopodobieństwo (0-100)</label>
//                     <input required type="number" min="0" max="100" value={risk.probability} onChange={(e) => handleRiskChange(index, 'probability', Number(e.target.value))} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Opis Ryzyka</label>
//                   <textarea required value={risk.description} onChange={(e) => handleRiskChange(index, 'description', e.target.value)} rows={2} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

        
//         <button type='submit' className='w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 mt-6 shadow-md cursor-pointer'>
//           Zapisz Projekt
//         </button>
//       </form>
//     </div>
//   )
// }

// export default CreateProjectForm