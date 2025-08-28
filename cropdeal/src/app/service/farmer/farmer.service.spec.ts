import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FarmerService, Farmer } from './farmer.service';

describe('FarmerService', () => {
  let service: FarmerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FarmerService],
    });
    service = TestBed.inject(FarmerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all farmers', () => {
    const mockFarmers: Farmer[] = [
      {
        farmer_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        address: '123 Street',
        district: 'District A',
        pincode: '123456',
        phone_no: '1234567890',
      },
    ];

    service.getAllFarmers().subscribe((farmers) => {
      expect(farmers.length).toBe(1);
      expect(farmers).toEqual(mockFarmers);
    });

    const req = httpMock.expectOne('http://localhost:8000/farmer/allFarmers');
    expect(req.request.method).toBe('GET');
    req.flush(mockFarmers);
  });

  it('should add a new farmer', () => {
    const newFarmer: Farmer = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      address: '456 Lane',
      district: 'District B',
      pincode: '654321',
      phone_no: '0987654321',
    };

    service.addFarmer(newFarmer).subscribe((response) => {
      expect(response).toBe('Farmer registered successfully');
    });

    const req = httpMock.expectOne('http://localhost:8000/farmer/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newFarmer);
    req.flush('Farmer registered successfully');
  });

  it('should delete a farmer', () => {
    const farmerId = 1;

    service.deleteFarmer(farmerId).subscribe((response) => {
      expect(response).toBe('Farmer deleted successfully');
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/delete/${farmerId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Farmer deleted successfully');
  });
});
