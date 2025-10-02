'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    memberNumber: '',
    interests: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/app/stock/api/customer');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showSnackbar('Error fetching customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        dateOfBirth: customer.dateOfBirth.split('T')[0],
        memberNumber: customer.memberNumber.toString(),
        interests: customer.interests
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        dateOfBirth: '',
        memberNumber: '',
        interests: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      dateOfBirth: '',
      memberNumber: '',
      interests: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...formData,
        memberNumber: parseInt(formData.memberNumber),
        dateOfBirth: new Date(formData.dateOfBirth)
      };

      let response;
      if (editingCustomer) {
        response = await fetch('/app/stock/api/customer', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingCustomer._id, ...customerData })
        });
      } else {
        response = await fetch('/app/stock/api/customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        });
      }

      if (response.ok) {
        showSnackbar(`Customer ${editingCustomer ? 'updated' : 'created'} successfully`);
        fetchCustomers();
        handleClose();
      } else {
        const error = await response.text();
        showSnackbar(error, 'error');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      showSnackbar('Error saving customer', 'error');
    }
  };

  const handleDelete = async (customerId) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const response = await fetch('/api/customer', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: customerId })
      });

      if (response.ok) {
        showSnackbar('Customer deleted successfully');
        fetchCustomers();
      } else {
        const error = await response.text();
        showSnackbar(error, 'error');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      showSnackbar('Error deleting customer', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading customers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customer Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Customer
        </Button>
      </Box>

      <Grid container spacing={3}>
        {customers.map((customer) => (
          <Grid item xs={12} sm={6} md={4} key={customer._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {customer.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Member #: {customer.memberNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={customer.interests} size="small" />
                </Box>
              </CardContent>
              <CardActions>
                <Link href={`/app/stock/customer/${customer._id}`}>
                  <IconButton size="small">
                    <ViewIcon />
                  </IconButton>
                </Link>
                <IconButton size="small" onClick={() => handleOpen(customer)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(customer._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Date of Birth"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              margin="dense"
              label="Member Number"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.memberNumber}
              onChange={(e) => setFormData({ ...formData, memberNumber: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Interests"
              fullWidth
              variant="outlined"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCustomer ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
