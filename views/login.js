<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" type="text/css" href="/bootstrap-4/css/bootstrap.min.css" />
	<title>Loan App | Login</title>
</head>
<body>
	<%- include ("./partials/navbar.ejs") %>
	<main class="container">
		<div class="row mt-5">
			<div class="col-sm-12 col-md-3 col-lg-3 col-xl-4"></div>
			<div class="col-sm-12 col-md-6 col-lg-6 col-xl-4 text-center" style="margin-top: 7rem;">
				<div class="card">
					<div class="card-body">
						<h1 class="text-uppercase mb-4">Sign In</h1>
						<form method="POST" action="/loan/login">
							<div class="form-group">
								<input type="text" class="form-control" placeholder="username" />
							</div>
							<div class="form-group">
								<input type="password" class="form-control" placeholder="password" />
							</div>
							<div class="text-center">
								<button class="btn btn-primary btn-block">Sign In</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="col-sm-12 col-md-3 col-lg-3 col-xl-4"></div>
		</div>
	</main>

	<script type="text/javascript" src="/bootstrap-4/js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="/bootstrap-4/js/popper.js"></script>
	<script type="text/javascript" src="/bootstrap-4/js/bootstrap.js"></script>
</body>
</html