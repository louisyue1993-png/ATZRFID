param(
    [Parameter(Mandatory = $false)]
    [string]$Domain
)

$ErrorActionPreference = 'Stop'

function Normalize-Domain {
    param([string]$InputDomain)

    if ([string]::IsNullOrWhiteSpace($InputDomain)) {
        if (-not [string]::IsNullOrWhiteSpace($env:NEXT_PUBLIC_SITE_URL)) {
            $InputDomain = $env:NEXT_PUBLIC_SITE_URL
        }
    }

    if ([string]::IsNullOrWhiteSpace($InputDomain)) {
        throw 'Domain is required. Use -Domain "https://your-domain.com" or set NEXT_PUBLIC_SITE_URL.'
    }

    $normalized = $InputDomain.Trim()
    if (-not ($normalized.StartsWith('http://') -or $normalized.StartsWith('https://'))) {
        $normalized = "https://$normalized"
    }

    $normalized = $normalized.TrimEnd('/')
    return $normalized
}

function Add-Result {
    param(
        [ref]$Results,
        [string]$Check,
        [bool]$Passed,
        [string]$Details
    )

    $status = if ($Passed) { 'PASS' } else { 'FAIL' }
    $Results.Value += [PSCustomObject]@{
        Check   = $Check
        Status  = $status
        Details = $Details
    }
}

function Invoke-JsonGet {
    param([string]$Url)

    $resp = Invoke-WebRequest -UseBasicParsing -Uri $Url -Method GET -TimeoutSec 30
    $obj = $null
    try {
        $obj = $resp.Content | ConvertFrom-Json
    }
    catch {
        throw "Response is not valid JSON: $Url"
    }

    return [PSCustomObject]@{
        StatusCode = [int]$resp.StatusCode
        Json       = $obj
        Raw        = $resp.Content
        FinalUrl   = $resp.BaseResponse.ResponseUri.AbsoluteUri
    }
}

function Invoke-StatusGet {
    param([string]$Url)

    $resp = Invoke-WebRequest -UseBasicParsing -Uri $Url -Method GET -TimeoutSec 30
    return [PSCustomObject]@{
        StatusCode = [int]$resp.StatusCode
        FinalUrl   = $resp.BaseResponse.ResponseUri.AbsoluteUri
        Length     = $resp.Content.Length
    }
}

$results = @()
$baseUrl = Normalize-Domain $Domain

Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Vercel Production Verification' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host "Target: $baseUrl" -ForegroundColor Yellow
Write-Host ''

# 1) Health
try {
    $health = Invoke-JsonGet "$baseUrl/api/health"
    $ok = ($health.StatusCode -eq 200) -and ($health.Json.success -eq $true) -and `
          ($health.Json.environment.envStatus -eq 'configured') -and `
          ($health.Json.database.dbStatus -eq 'connected')
    $detail = "status=$($health.StatusCode), success=$($health.Json.success), env=$($health.Json.environment.envStatus), db=$($health.Json.database.dbStatus)"
    Add-Result -Results ([ref]$results) -Check 'Health API' -Passed $ok -Details $detail
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Health API' -Passed $false -Details $_.Exception.Message
}

# 2) Public products API
try {
    $productsApi = Invoke-JsonGet "$baseUrl/api/products?limit=5"
    $ok = ($productsApi.StatusCode -eq 200) -and ($productsApi.Json.success -eq $true)
    $detail = "status=$($productsApi.StatusCode), success=$($productsApi.Json.success), count=$($productsApi.Json.count)"
    Add-Result -Results ([ref]$results) -Check 'Public Products API' -Passed $ok -Details $detail
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Public Products API' -Passed $false -Details $_.Exception.Message
}

# 3) Public blog API
try {
    $blogApi = Invoke-JsonGet "$baseUrl/api/blog?limit=5"
    $ok = ($blogApi.StatusCode -eq 200) -and ($blogApi.Json.success -eq $true)
    $detail = "status=$($blogApi.StatusCode), success=$($blogApi.Json.success), count=$($blogApi.Json.count)"
    Add-Result -Results ([ref]$results) -Check 'Public Blog API' -Passed $ok -Details $detail
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Public Blog API' -Passed $false -Details $_.Exception.Message
}

# 4) Frontend pages
try {
    $productsPage = Invoke-StatusGet "$baseUrl/products"
    $ok = ($productsPage.StatusCode -eq 200)
    $detail = "status=$($productsPage.StatusCode), len=$($productsPage.Length)"
    Add-Result -Results ([ref]$results) -Check 'Products Page' -Passed $ok -Details $detail
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Products Page' -Passed $false -Details $_.Exception.Message
}

try {
    $blogPage = Invoke-StatusGet "$baseUrl/blog"
    $ok = ($blogPage.StatusCode -eq 200)
    $detail = "status=$($blogPage.StatusCode), len=$($blogPage.Length)"
    Add-Result -Results ([ref]$results) -Check 'Blog Page' -Passed $ok -Details $detail
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Blog Page' -Passed $false -Details $_.Exception.Message
}

try {
    $adminLoginPage = Invoke-StatusGet "$baseUrl/admin/login"
    $ok = ($adminLoginPage.StatusCode -eq 200)
    $detail = "status=$($adminLoginPage.StatusCode), finalUrl=$($adminLoginPage.FinalUrl)"
    Add-Result -Results ([ref]$results) -Check 'Admin Login Page' -Passed $ok -Details $detail
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Admin Login Page' -Passed $false -Details $_.Exception.Message
}

# 5) Admin API unauthenticated protection
try {
    $null = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/api/admin/products" -Method GET -TimeoutSec 30
    Add-Result -Results ([ref]$results) -Check 'Admin API Unauth Protection' -Passed $false -Details 'Unexpected 200 for unauthenticated request'
}
catch {
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode.value__
        $ok = ($statusCode -eq 401)
        Add-Result -Results ([ref]$results) -Check 'Admin API Unauth Protection' -Passed $ok -Details "status=$statusCode"
    }
    else {
        Add-Result -Results ([ref]$results) -Check 'Admin API Unauth Protection' -Passed $false -Details $_.Exception.Message
    }
}

# 6) Admin page unauthenticated redirect protection
try {
    $adminProducts = Invoke-StatusGet "$baseUrl/admin/products"
    $finalUrl = $adminProducts.FinalUrl
    $ok = ($adminProducts.StatusCode -eq 200) -and ($finalUrl -match '/admin/login')
    Add-Result -Results ([ref]$results) -Check 'Admin Page Redirect Protection' -Passed $ok -Details "status=$($adminProducts.StatusCode), finalUrl=$finalUrl"
}
catch {
    Add-Result -Results ([ref]$results) -Check 'Admin Page Redirect Protection' -Passed $false -Details $_.Exception.Message
}

Write-Host ''
Write-Host 'Verification Results' -ForegroundColor Cyan
Write-Host '----------------------------------------' -ForegroundColor Cyan
$results | Format-Table -AutoSize

$passCount = ($results | Where-Object { $_.Status -eq 'PASS' }).Count
$failCount = ($results | Where-Object { $_.Status -eq 'FAIL' }).Count

Write-Host ''
Write-Host "PASS: $passCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "FAIL: $failCount" -ForegroundColor Red
    Write-Host ''
    Write-Host 'Result: PRODUCTION VERIFICATION FAILED' -ForegroundColor Red
    Write-Host 'Action: Fix failed checks, then re-run this script.' -ForegroundColor Yellow
    exit 1
}

Write-Host "FAIL: $failCount" -ForegroundColor Green
Write-Host ''
Write-Host 'Result: PRODUCTION VERIFICATION PASSED' -ForegroundColor Green
Write-Host 'Next: You can check the final Vercel gate item in GO_LIVE_ACCEPTANCE_CHECKLIST.md.' -ForegroundColor Cyan
exit 0
