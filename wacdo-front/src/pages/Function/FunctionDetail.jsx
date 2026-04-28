import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Modal from "../../components/Modal";
import ListWithFilter from "../../components/ListWithFilter";
import Card from "../../components/Card";
import AssignCollaboratorForm from "../../components/forms/AssignCollaboratorForm";

export default function FunctionDetailPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const resFunction = await api.get(`/api/jobsrants/${id}`);
      setRestaurant(resRestaurant.data);

      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  
  if (loading) return <p className="p-6">Chargement...</p>;
  if (!job) return <p className="p-6">Fonction introuvable</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{job.labelFunction}</h1>

      <div className="flex gap-2 mb-4">
      

         </div>    
    </div>
  );
}