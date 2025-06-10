import * as caregivers from '$lib/models/students';


export async function fetchAllStudents() {
  const { data, error } = await StudentModel.getAllStudents();
  if (error) throw new Error(error.message);
  return data;
}
