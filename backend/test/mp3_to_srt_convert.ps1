Add-Type -AssemblyName System.Net.Http

# $PSVersionTable.PSVersion
# PowerShell 5.1에서 제작됨.  
# 이 명령어를 써서 꼭 UTF-8 with BOM으로 5.1 에서는 저장해야한다. 
# 그 상위 버전은 UTF-8로 저장하면 해결됨.


$Uri = 'http://localhost:3000/api/convertMp3ToSTT'
$jobId = '0612000754_08e6f0ec'



function Write-Log {
    param(
        [string]$Step,
        [object]$Data = $null
    )

    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff'

    if ($null -eq $Data) {
        Write-Host "[$timestamp] $Step"
        return
    }

    $json = $Data | ConvertTo-Json -Depth 10 -Compress
    Write-Host "[$timestamp] $Step $json"
}


$HttpClient = [System.Net.Http.HttpClient]::new()

try {
    $BodyObject = @{
        jobId = $JobId
    }

    $JsonBody = $BodyObject | ConvertTo-Json -Depth 10

    $Content = [System.Net.Http.StringContent]::new(
        $JsonBody,
        [System.Text.Encoding]::UTF8,
        "application/json"
    )

    

    Write-Log 'made Data' @{ url = $Url }
    Write-Host "$JsonBody"

    $Response = $HttpClient.PostAsync($Uri, $Content).GetAwaiter().GetResult()
    $ResponseBody = $Response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

    Write-Log 'API response received' @{ statusCode = $Response.StatusCode; body = $ResponseBody }
     
    if (-not $Response.IsSuccessStatusCode) {
        throw "API request failed. StatusCode=$($Response.StatusCode), Body=$ResponseBody"
    }
}
finally {
    $HttpClient.Dispose()
}