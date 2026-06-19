Add-Type -AssemblyName System.Net.Http

# $PSVersionTable.PSVersion
# PowerShell 5.1에서 제작됨.  
# 이 명령어를 써서 꼭 UTF-8 with BOM으로 5.1 에서는 저장해야한다. 
# 그 상위 버전은 UTF-8로 저장하면 해결됨.

# 콘솔 출력시 한글 깨짐현상 해결
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
Write-Host 'abc'
Write-Host '직접 입력 한글 테스트'
# Write-Host '직접 입력 한글 테스트' 


$Uri = 'http://localhost:3000/upload'
$FilePath = 'E:\new_age_test\YT_anting_1080p.mp4'
$FieldName = 'video'
$ContentType = 'video/mp4'


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


try {
    $FileName = Get-Item -LiteralPath $FilePath
    $FilePath

    Write-Log 'make file object' @{ uri = $Uri; filePath = $FilePath; fieldName = $FieldName }

    $FileStream = [System.IO.FileStream]::new($FileName, [System.IO.FileMode]::Open)
    # $FileHeader = [System.Net.Http.Headers.ContentDispositionHeaderValue]::new('form-data')
    # $FileHeader.Name = $FieldName
    # $FileHeader.FileName = Split-Path -Leaf $


    $FileContent = [System.Net.Http.StreamContent]::new($FileStream)
    # $FileContent.Headers.ContentDisposition = $FileHeader
    $FileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse($ContentType)

    # Debugging
    # 업로드 전 확인
    $FileName
    # $FileStream.Position = 0
    # $FileStream.CanRead
    $FileStream.Length
    # $FileContent.Headers


    $MultipartContent = [System.Net.Http.MultipartFormDataContent]::new()
    $MultipartContent.Add($FileContent,$FieldName, $FileName)

    ## Debugging Multipart 전체 헤더 확인
    # $MultipartContent.Headers
    ## Multipart 안에 들어간 각 파트 확인
    # foreach ($Part in $MultipartContent) {
    #   "---- PART ----"
    #   $Part.GetType().FullName
    #   $Part.Headers
    # }

    $HttpClient = [System.Net.Http.HttpClient]::new()


    # 💡 [.GetAwaiter().GetResult()] 를 사용하여 전송이 끝날 때까지 스크립트 진행을 '완벽히' 고정합니다.
    $ResponseTask = $HttpClient.PostAsync($Uri, $MultipartContent)
    $Response = $ResponseTask.GetAwaiter().GetResult()
    
    $ResponseContentTask = $Response.Content.ReadAsStringAsync()
    $ResponseContent = $ResponseContentTask.GetAwaiter().GetResult()
    
    Write-Host "Status Code: $($Response.StatusCode)"
    Write-Host "Response: $ResponseContent"
}
catch {
    Write-Error $_.Exception.Message
}
finally {
    # ⚠️ 반드시 데이터 전송이 완전히 '끝난 후'에 자원을 해제해야 합니다.
    if ($null -ne $FormData) { $FormData.Dispose() }
    if ($null -ne $FileContent) { $FileContent.Dispose() }
    if ($null -ne $FileStream) { $FileStream.Dispose() }
    if ($null -ne $HttpClient) { $HttpClient.Dispose() }
}
