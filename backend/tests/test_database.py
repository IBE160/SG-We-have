from unittest.mock import patch, MagicMock
import os
import pytest
import sys

# Fixture to reload modules (ensures fresh imports)
@pytest.fixture(autouse=True)
def reload_modules():
    modules_to_delete = ['app.core.database', 'app.main', 'app.core.config']
    for module in modules_to_delete:
        if module in sys.modules:
            del sys.modules[module]
    yield
    for module in modules_to_delete:
        if module in sys.modules:
            del sys.modules[module]


def test_get_supabase_client(reload_modules):
    # Patch create_client directly from the supabase library, as it's called inside get_supabase_client
    with patch('supabase.create_client') as mock_create_client:
        mock_client_instance = MagicMock()
        mock_create_client.return_value = mock_client_instance
        
        # Patch os.environ for get_supabase_client to not raise ValueError for missing env vars
        with patch.dict(os.environ, {
            "SUPABASE_URL": "http://test.supabase.co",
            "SUPABASE_SERVICE_ROLE_KEY": "test-key"
        }):
            from app.core.database import get_supabase_client
            client = get_supabase_client()
            assert client is mock_client_instance
            mock_create_client.assert_called_once()


def test_verify_supabase_connection_success(reload_modules):
    # Mock get_supabase_client to return a mock client
    with patch('app.core.database.get_supabase_client') as mock_get_supabase_client:
        mock_client_instance = MagicMock()
        mock_get_supabase_client.return_value = mock_client_instance
        
        mock_response = MagicMock()
        mock_response.data = [{"id": 1}]
        mock_client_instance.table.return_value.select.return_value.limit.return_value.execute.return_value = mock_response
        
        from app.core.database import verify_supabase_connection
        result = verify_supabase_connection()
        assert result is True
        mock_get_supabase_client.assert_called_once()
        mock_client_instance.table.assert_called_once_with("courses")


def test_verify_supabase_connection_failure(reload_modules):
    # Mock get_supabase_client to return a mock client
    with patch('app.core.database.get_supabase_client') as mock_get_supabase_client:
        mock_client_instance = MagicMock()
        mock_get_supabase_client.return_value = mock_client_instance

        mock_client_instance.table.return_value.select.return_value.limit.return_value.execute.side_effect = Exception("Connection error")

        from app.core.database import verify_supabase_connection
        result = verify_supabase_connection()
        assert result is False
        mock_get_supabase_client.assert_called_once()
        mock_client_instance.table.assert_called_once_with("courses")