<?php
class FlowchAPIIntegration {
    private $apiUrl;
    private $token;
    private $headers;

    public function __construct($apiUrl, $token) {
        $this->apiUrl = $apiUrl;
        $this->token = $token;
        $this->headers = [
            'Authorization: integration ' . $this->token,
            'Content-Type: application/json',
            'acceptLanguage: pt'
        ];
    }

    public function validateContactData($data) {
        $errors = [];
        $requiredFields = [
            'name' => 'Nome é obrigatório',
            'email' => 'E-mail corporativo é obrigatório',
            'phone' => 'Telefone é obrigatório',
            'revenue' => 'Faturamento anual é obrigatório',
        ];

        foreach ($requiredFields as $field => $errorMessage) {
            if (empty(trim($data[$field]))) {
                $errors[] = $errorMessage;
            }
        }

        return $errors;
    }

    public function mapFormDataToAPIPayload($formData) {
        return [
            'cont_status' => 1,
            'nome' => $formData['name'],
            'email_corporativo' => $formData['email'],
            'telefone' => $formData['phone'],
            'fat_anual' => $formData['revenue'],
        ];
    }

    public function sendContact($contactData) {
        $validationErrors = $this->validateContactData($contactData);
        if (!empty($validationErrors)) {
            return [
                'success' => false,
                'errors' => $validationErrors
            ];
        }

        $payload = $this->mapFormDataToAPIPayload($contactData);

        $ch = curl_init($this->apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            $curlError = curl_error($ch);
            curl_close($ch);
            return [
                'success' => false,
                'errors' => ['Erro de conexão: ' . $curlError]
            ];
        }
        
        curl_close($ch);

        $responseData = json_decode($response, true);

        if ($httpCode == 200 && isset($responseData['recordsInserted']) && $responseData['recordsInserted'] > 0) {
            return [
                'success' => true,
                'data' => $responseData
            ];
        } else {
            $apiErrors = $responseData['errors'] ?? ['Erro desconhecido no servidor, tente novamente mais tarde.'];
            return [
                'success' => false,
                'errors' => $apiErrors,
                'raw_response' => $responseData
            ];
        }
    }

    private function generateGuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $apiUrl = 'https://int01.flowch.com/integrator/522889c4-d0c6-4385-9860-df7e6deac08e/inclusao';
    $apiToken = 'a4bf89378f94cb3c63530a6c9439cd0f';

    $apiIntegration = new FlowchAPIIntegration($apiUrl, $apiToken);

    $formData = [
        'name' => $_POST['name'],
        'email' => $_POST['email'],
        'phone' => preg_replace('/\D/', '', $_POST['phone']),
        'revenue' => $_POST['revenue'],
    ];

    $result = $apiIntegration->sendContact($formData);

    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}
?>